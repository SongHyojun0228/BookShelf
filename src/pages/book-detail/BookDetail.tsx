import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../../components/layout/Sidebar';
import '../../App.css';
import './BookDetail.css';
import Loading from '../../components/common/Loading';
import { supabase } from '../../supabase';

interface bookDeatilData {
  itemid: number
  title: string
  author: string
  cover: string
  publisher: string
  pubDate: string
  categoryName: string
  isbn13: string
  description: string
  subInfo?: {
    itemPage?: number
  }
}

interface BookReview {
  review_id: number;
  user_id: number;
  book_id: number;
  description: string;
  star: number;
  created_at: string;
  likes_count: number;
  Users?: {
    nickname: string;
  };
}

const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

const BookDetail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [bookData, setBookData] = useState<bookDeatilData | null>(null);
  const [bookId, setBookId] = useState<number>(0);
  const [isInMyLibrary, setIsInMyLibrary] = useState(false);
  const [bookStatus, setBookStatus] = useState("");
  const [bookReviews, setBookReviews] = useState<BookReview[] | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("최신순");
  const [libraryAddedCount, setLibraryAddedCount] = useState<number>(0);

  useEffect(() => {
    if (!id) return;

    const fetchBooks = async () => {
      setIsLoading(true);

      try {
        const ttbKey = 'ttbhyojun230011523001';
        const url = `/aladin-api/ttb/api/ItemLookUp.aspx?ttbkey=${ttbKey}&itemIdType=ItemId&ItemId=${id}&output=js&Version=20131101&OptResult=itemPage`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.item && data.item.length > 0) {
          setBookData(data.item[0]);
        }
      } catch (error) {
        console.log("검색 중 오류(알라딘 API) : ", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBooks();
  }, [id]);

  useEffect(() => {
    if (!bookData) return;

    const fetchInMyLibrary = async () => {
      setIsLoading(true)
      setIsInMyLibrary(false);

      try {
        const { data: myBookId } =
          await supabase.from('Books')
            .select(`*`)
            .eq('title', bookData.title)
            .eq('author', bookData.author)

        if (myBookId) {
          setBookId(myBookId[0].book_id);

          const { data, error } =
            await supabase.from('MyLibrary')
              .select(
                `*`
              )
              .eq('user_id', UUID)
              .eq('book_id', myBookId[0].book_id)

          if (error) {
            throw error;
          }

          if (data) {
            setIsInMyLibrary(true);
            setBookStatus(data[0].status);
          }
        }
      } catch (error) {
        console.log("내 서재에 있는 지 확인 에러", error);
      } finally {
        setIsLoading(false);
      }
    }


    fetchInMyLibrary();

  }, [bookData]);

  useEffect(() => {

    const fetchRecentBookReviews = async () => {
      if (bookId === 0) return;

      setIsLoading(true);

      try {
        const { data: reviewData, error: reviewError }
          = await supabase.from('reviews_with_likes')
            .select(`
              *,
              Users(*),
              Books(*)
            `)
            .eq("book_id", bookId)
            .order("created_at", { ascending: false })

        if (reviewError) throw reviewError;

        if (reviewData) {
          setBookReviews(reviewData);
        }
      } catch (error) {
        console.log("리뷰 불러오기 에러 : ", error)
      } finally {
        setIsLoading(false);
      }
    }

    const fetchLibraryAddedCount = async () => {
      if (bookId === 0) return;
      try {
        const { count, error } = await supabase
          .from('MyLibrary')
          .select('*', { count: 'exact', head: true })
          .eq('book_id', bookId);

        if (error) throw error;
        setLibraryAddedCount(count || 0);
      } catch (error) {
        console.log("서재에 담은 사람 카운트 에러: ", error);
      }
    };

    fetchRecentBookReviews();
    fetchLibraryAddedCount();
  }, [bookId]);

  const fetchReviewsOrder = async (orderColumn: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.from('reviews_with_likes')
        .select(`*, Users(*)`) // ⬅️ Users(*) 조인을 넣어야 유저 이름이 뜹니다!
        .eq('book_id', bookId)
        .order(orderColumn, { ascending: false });
      if (error) throw error;
      if (data) setBookReviews(data);
    } catch (error) {
      console.log(`${orderColumn} 기준 리뷰 로딩 에러 :`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSortChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSortOrder(value);

    if (value === "최신순") {
      if (bookId === 0) return;

      setIsLoading(true);

      try {
        const { data: reviewData, error: reviewError }
          = await supabase.from('reviews_with_likes')
            .select(`
              *,
              Users(*),
              Books(*)
            `)
            .eq("book_id", bookId)
            .order("created_at", { ascending: false })

        if (reviewError) throw reviewError;

        if (reviewData) {
          setBookReviews(reviewData);
        }
      } catch (error) {
        console.log("리뷰 불러오기 에러 : ", error)
      } finally {
        setIsLoading(false);
      }
    } else if (value === "인기순") {
      fetchReviewsOrder("likes_count");
    }
    else if (value === "별점 높은 순") {
      fetchReviewsOrder("star");
    }
  }

  // 평점 평균 계산 부분 삽입!
  const averageRating = bookReviews && bookReviews.length > 0
    ? Number((bookReviews.reduce((sum, review) => sum + review.star, 0) / bookReviews.length).toFixed(1))
    : 0.0;

  return (
    <div className="total-page">
      <Sidebar />
      <div className="main-page book-detail-page">
        {/* Top: Book Info Section */}
        <section className="book-detail-header-card">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 뒤로 가기
          </button>

          {isLoading || !bookData || !bookReviews ? <Loading text="책 정보" /> :
            <div className="book-profile-content">
              {/* Left: Book Cover */}
              <div className="book-cover-large">
                <img src={bookData.cover} alt={bookData.title} style={{ width: '100%', height: '100%' }} />
              </div>

              {/* Center: Information */}
              <div className="book-info-center">
                <h1 className="book-title-large">{bookData.title}</h1>
                <p className="book-author-large">{bookData.author} 저</p>

                <div className="book-rating-summary">
                  <div className="star-rating-wrapper" style={{ position: 'relative', display: 'inline-block', color: '#e0e0e0', fontSize: '1.2rem' }}>
                    <span>★★★★★</span>
                    <span
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        color: '#FFA500',
                        overflow: 'hidden',
                        width: `${(averageRating / 5) * 100}%`,
                        whiteSpace: 'nowrap'
                      }}>
                      ★★★★★
                    </span>
                  </div>
                  <span className="rating-score">{averageRating.toFixed(1)}</span>
                  <span className="review-count">({bookReviews.length}개)</span>
                </div>

                <div className="book-metadata-grid">
                  <div className="meta-item">
                    <span className="meta-label">출판사</span>
                    <span className="meta-value">{bookData.publisher}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">출간일</span>
                    <span className="meta-value">{bookData.pubDate}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">카테고리</span>
                    <span className="meta-value">{bookData.categoryName}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">ISBN</span>
                    <span className="meta-value">{bookData.isbn13}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">쪽수</span>
                    <span className="meta-value">{bookData.subInfo?.itemPage ? `${bookData.subInfo.itemPage}쪽` : '정보 없음'}</span>
                  </div>
                </div>

                <div className="book-description">
                  <p>
                    {bookData.description}
                  </p>
                  <button className="read-more-btn">더보기 →</button>
                </div>
              </div>

              {/* Right: Actions & Stats */}
              <div className="book-actions-right">
                <div className="action-buttons">
                  {!isInMyLibrary ?
                    <button className="btn-primary-large">
                      <span className="icon">+</span> 서재에 담기
                    </button> :
                    <div className="status-indicator reading">
                      내 서재에 있음 · {bookStatus}
                    </div>
                  }
                </div>

                <div className="statistics-box">
                  <h3 className="stats-title">이 책의 통계</h3>
                  <div className="stats-row">
                    <span className="stats-label">평균 완독일</span>
                    <span className="stats-value">7일</span>
                  </div>
                  <div className="stats-row">
                    <span className="stats-label">서재에 담은 사람</span>
                    <span className="stats-value">{libraryAddedCount}명</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </section>

        {isLoading || !bookReviews ? <Loading text="책 리뷰" /> :
          <section className="reviews-section">
            <div className="reviews-header">
              <h2>리뷰 {bookReviews.length}개</h2>
              <div className="reviews-actions">
                <select className="sort-dropdown" value={sortOrder} onChange={handleReviewSortChange}>
                  <option value="최신순">최신순</option>
                  <option value="인기순">인기순</option>
                  <option value="별점 높은 순">별점 높은순</option>
                </select>
                <button className="btn-write-review-small">리뷰 쓰기</button>
              </div>
            </div>

            <div className="reviews-list">
              {bookReviews.map((review, index) => (
                <div key={review.review_id || index} className="review-card">
                  <div className="review-user-info">
                    <div className="avatar-placeholder"></div>
                    <div className="user-details">
                      <span className="user-name">{review.Users?.nickname || '독서가'}</span>
                      <span className="user-rating">{"★".repeat(review.star || 5)}</span>
                    </div>
                    <span className="review-date">{new Date(review.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <div className="review-content">
                    <p>
                      {review.description}
                    </p>
                  </div>
                  <div className="review-footer">
                    <button className="btn-like">❤️ {review.likes_count}</button>
                    <button className="btn-comment">💬 0</button>
                    <span className="btn-report">신고</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn-load-more">더보기</button>
          </section>
        }

        {/* Bottom: Similar Books */}
        <section className="similar-books-section">
          <h2>비슷한 책</h2>
          <div className="similar-books-row">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="similar-book-card">
                <div className="similar-cover-placeholder"></div>
                <span className="similar-book-title">추천 도서 {item}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default BookDetail;
