import { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import Sidebar from '../../components/layout/Sidebar';
import './Community.css';

const MOCK_DATA: Record<string, any[]> = {
    '팔로잉 피드': [
        { id: 1, user: '감자조림', activity: '새 책을 서재에 담았어요', book: '파친코 — 이민진', content: '', time: '방금 전', likes: 12 },
        { id: 3, user: '책벌레진', activity: '책을 다 읽었어요!', book: '아토믹 해빗 — 제임스 클리어', content: '', time: '5시간 전', likes: 12 },
    ],
    '인기 리뷰': [
        { id: 2, user: '독서왕', activity: '리뷰를 남겼어요', book: '역행자 — 자청', content: '자기계발서 중 가장 현실적인 조언. 특히 3장의...', time: '5분 전', likes: 45 },
        { id: 5, user: '무지개', activity: '리뷰를 남겼어요', book: '슬램덩크 — 이노우에 다케히코', content: '왼손은 거들 뿐... 제 인생 최고의 만화입니다.', time: '2시간 전', likes: 38 },
    ],
    '최신 리뷰': [

    ]
};

const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

function Community() {

    const [activeTab, setActiveTab] = useState('팔로잉 피드');

    const [recentReviews, setRecentReviews] = useState<any[]>([]);
    const [followingReviews, setFollowingReviews] = useState<any[]>([]);
    const [popularReviews, setPopularReviews] = useState<any[]>([]);

    useEffect(() => {
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

        handleRecentReview();
        handleFollowReview();
        handleManyLikesReviews();
    }, []);

    return (
        <div className='total-page'>
            <Sidebar />

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
                        {(activeTab === '최신 리뷰' ? recentReviews : (activeTab === '팔로잉 피드' ? followingReviews : (activeTab === '인기 리뷰' ? popularReviews : MOCK_DATA[activeTab]))).map((item) => {
                            const isDBData = activeTab === '최신 리뷰' || activeTab === '팔로잉 피드' || activeTab === '인기 리뷰';
                            return (
                                <div key={item.review_id || item.id} className="feed-item">
                                    <div className="user-avatar">
                                        <div className="avatar-placeholder">
                                            {isDBData ? item.Users?.nickname?.[0] : item.user?.[0]}
                                        </div>
                                    </div>
                                    <div className="feed-content">
                                        <div className="feed-header">
                                            <span className="user-name">
                                                {isDBData ? item.Users?.nickname : item.user}
                                            </span>
                                            <span className="activity-type">
                                                {isDBData ? '님이 리뷰를 남겼어요' : item.activity}
                                            </span>
                                            <div className="feed-stats">
                                                <span className="star-rating">⭐ {isDBData ? item.star : '목데이터'}</span>
                                                <span className="heart-icon">
                                                    ❤️ {isDBData ? (item.likes_count ?? 0) : item.likes}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="book-summary">
                                            <span className="book-info-text">
                                                {isDBData ? `${item.Books?.title} — ${item.Books?.author}` : item.book}
                                            </span>
                                        </div>
                                        <p className="review-text">
                                            "{isDBData ? item.description : item.content}"
                                        </p>
                                        <div className="feed-footer">
                                            <span className="time-ago">
                                                {isDBData
                                                    ? new Date(item.created_at).toLocaleDateString()
                                                    : item.time}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
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
                        <h3>📈 인기 도서</h3>
                        <div className="trending-list">
                            {[
                                { rank: 1, title: '불편한 편의점' },
                                { rank: 2, title: '역행자' },
                                { rank: 3, title: '아토믹 해빗' }
                            ].map((item) => (
                                <div key={item.rank} className="trending-item">
                                    <span className="rank">{item.rank}</span>
                                    <span className="title">{item.title}</span>
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
