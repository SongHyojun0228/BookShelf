import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import Loading from '../../components/common/Loading';
import Sidebar from '../../components/layout/Sidebar';
import Addbookmodal from '../../components/modal/Addbookmodal';
import ReviewDetailModal from '../../components/modal/ReviewDetailModal';
import './Community.css';

const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

function Community() {

    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('팔로잉 피드');
    const [popularBooks, setPopularBooks] = useState<any[]>([]);
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [isOnAddBookModal, setIsOnAddBookModal] = useState(false);
    const [recentReviews, setRecentReviews] = useState<any[]>([]);
    const [followingReviews, setFollowingReviews] = useState<any[]>([]);
    const [popularReviews, setPopularReviews] = useState<any[]>([]);
    const [isOnReviewDetailModal, setIsOnReviewDetailModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState<any>(null);

    useEffect(() => {
        const handlePopularBooks = async () => {
            try {
                setIsLoading(true)
                const { data: popularBooks, error: popularBookError }
                    = await supabase.from('popular_books')
                        .select(`*`)
                        .limit(5);

                if (popularBookError) throw popularBookError;

                setPopularBooks(popularBooks);
            } catch (error) {
                console.log("인기도서 에러 : ", error);
            } finally {
                setIsLoading(false);
            }
        }


        const handleRecentReview = async () => {
            try {
                const { data, error }
                    = await supabase.from('reviews_with_likes')
                        .select(`
                            *,
                            Books (
                                *
                            ),
                            Users (
                                *
                            )
                        `)
                        .order('created_at', { ascending: false })

                console.log("최신리뷰 : ", data);

                if (error) throw error;

                setRecentReviews(data);
            } catch (error) {
                console.log("최신 리뷰 불러오기 오류 : ", error);
            }
        }

        const handleFollowReview = async () => {
            try {
                const { data: followData, error: followError }
                    = await supabase.from('Follows')
                        .select('followed_user')
                        .eq('following_user', UUID)

                console.log("팔로잉(로그인 유저) 아이디 : ", followData);


                if (!followData) return;
                if (followError) throw followError;

                const followedIds = followData.map(f => f.followed_user);

                const { data: followReviewData, error: followReviewError }
                    = await supabase.from('reviews_with_likes')
                        .select(`
                            *,
                            Books (*),
                            Users (*)    
                        `)
                        .in('user_id', followedIds)
                        .order('created_at', { ascending: false })

                if (followReviewError) throw followReviewError;

                console.log("팔로잉 리뷰 : ", followReviewData);
                if (followReviewData) setFollowingReviews(followReviewData);
            } catch (error) {
                console.log("팔로잉 리뷰 불러오기 오류 : ", error);
            }
        }

        const handleManyLikesReviews = async () => {
            try {
                const { data: manyLikesReviewsData, error: manyLikesReviewsError }
                    = await supabase.from('reviews_with_likes')
                        .select(`
                            *,
                            Books(*),
                            Users(*)
                        `)
                        .order('likes_count', { ascending: false })

                if (manyLikesReviewsError) throw manyLikesReviewsError;

                if (!manyLikesReviewsData) return;

                console.log("인기 리뷰 : ", manyLikesReviewsData);
                if (manyLikesReviewsData) setPopularReviews(manyLikesReviewsData);
            } catch (error) {
                console.log("인기 리뷰 불러오기 오류 : ", error);
            }
        }

        handlePopularBooks();
        handleRecentReview();
        handleFollowReview();
        handleManyLikesReviews();
    }, []);

    return (
        <div className='total-page'>
            <Sidebar />
            {isOnAddBookModal ? <Addbookmodal onClose={() => setIsOnAddBookModal(false)} book={selectedBook} /> : null}
            {isOnReviewDetailModal ? <ReviewDetailModal onClose={() => setIsOnReviewDetailModal(false)} review={selectedReview} /> : null}

            <div className='main-page community-page'>
                <div className='community-content'>
                    <header className="community-header">
                        <div className="header-text">
                            <h1>커뮤니티</h1>
                            <p>사람들의 다양한 독서 활동을 만나보세요</p>
                        </div>
                    </header>

                    <div className="community-tabs">
                        {['팔로잉 피드', '인기 리뷰', '최신 리뷰'].map((tab) => (
                            <button
                                key={tab}
                                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="feed-container">
                        {isLoading ? <div style={{ marginTop: '50px' }}>
                            <Loading text="리뷰 / 추천유저 / 인기도서" />
                        </div> :
                            (activeTab === '최신 리뷰' ? recentReviews : (activeTab === '팔로잉 피드' ? followingReviews : popularReviews)).map((item) => (
                                <div key={item.review_id} className="feed-item" onClick={() => { setSelectedReview(item); setIsOnReviewDetailModal(true); }}>
                                    <div className="user-avatar">
                                        <div className="avatar-placeholder">
                                            {item.Users?.nickname?.[0]}
                                        </div>
                                    </div>
                                    <div className="feed-content">
                                        <div className="feed-header">
                                            <span className="user-name">
                                                {item.Users?.nickname}
                                            </span>
                                            <span className="activity-type">
                                                님이 리뷰를 남겼어요
                                            </span>
                                            <div className="feed-stats">
                                                <span className="star-rating">⭐ {item.star}</span>
                                                <span className="heart-icon">
                                                    ❤️ {item.likes_count ?? 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="book-summary">
                                            <span className="book-info-text">
                                                {item.Books?.title} — {item.Books?.author}
                                            </span>
                                        </div>
                                        <p className="review-text">
                                            "{item.description}"
                                        </p>
                                        <div className="feed-footer">
                                            <span className="time-ago">
                                                {new Date(item.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>

                <aside className="community-sidebar">
                    <section className="recommend-section">
                        <h3>추천 유저</h3>
                        <div className="recommend-list">
                            {[
                                { name: '책벌레진', count: '152권 읽음' },
                                { name: '문학소녀', count: '89권 읽음' },
                                { name: 'SF마니아', count: '64권 읽음' },
                                { name: '에세이스트', count: '41권 읽음' }
                            ].map((user, idx) => (
                                <div key={idx} className="recommend-user-item">
                                    <div className="mini-avatar"></div>
                                    <div className="user-info">
                                        <span className="name">{user.name}</span>
                                        <span className="count">{user.count}</span>
                                    </div>
                                    <button className="btn-follow">팔로우</button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="trending-section">
                        <h3>🔥 실시간 인기 도서</h3>
                        <div className="trending-list">
                            {popularBooks.map((book, index) => (
                                <div key={book.book_id} className="trending-item" onClick={() => { setIsOnAddBookModal(true); setSelectedBook(book) }}>
                                    <span className={`rank rank-${index + 1}`}>{index + 1}</span>
                                    <div className="trending-book-cover">
                                        <img src={book.img} alt={book.title} />
                                    </div>
                                    <div className="trending-book-info">
                                        <span className="title">{book.title}</span>
                                        <span className="author">{book.author}</span>
                                        <span className="shelf-count">
                                            📚 {book.shelf_count}명이 담았어요
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default Community;
