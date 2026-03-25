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
}

const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

const BookDetail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [bookData, setBookData] = useState<bookDeatilData | null>(null);
  const [isInMyLibrary, setIsInMyLibrary] = useState(false);
  const [bookStatus, setBookStatus] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBooks = async () => {
      setIsLoading(true);

      try {
        const ttbKey = 'ttbhyojun230011523001';
        const url = `/aladin-api/ttb/api/ItemLookUp.aspx?ttbkey=${ttbKey}&itemIdType=ItemId&ItemId=${id}&output=js&Version=20131101`;
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
      setIsInMyLibrary(false);

      try {
        const { data: myBookId } =
          await supabase.from('Books')
            .select(`*`)
            .eq('title', bookData.title)
            .eq('author', bookData.author)

        if (myBookId) {
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
            console.log("data : ", data);
            setIsInMyLibrary(true);
            setBookStatus(data[0].status);
          }
        }
      } catch (error) {
        console.log("내 서재에 있는 지 확인 에러", error);
      }
    }

    fetchInMyLibrary();
  }, [bookData]);

  return (
    <div className="total-page">
      <Sidebar />
      <div className="main-page book-detail-page">
        {/* Top: Book Info Section */}
        <section className="book-detail-header-card">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← 뒤로 가기
          </button>

          {isLoading || !bookData ? <Loading text="책 정보" /> :
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
                  <span className="stars">★★★★☆</span>
                  <span className="rating-score">4.2</span>
                  <span className="review-count">(리뷰 128개)</span>
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
                  <button className="btn-primary-large">
                    <span className="icon">+</span> 서재에 담기
                  </button>
                  <button className="btn-secondary-large">
                    <span className="icon">✏️</span> 리뷰 쓰기
                  </button>
                </div>

                <div className="status-indicator reading">
                  {!isInMyLibrary ? "내 서재에 없음" : `내 서재에 있음 · ${bookStatus}`}
                </div>

                <div className="statistics-box">
                  <h3 className="stats-title">이 책의 통계</h3>
                  <div className="stats-row">
                    <span className="stats-label">평균 완독일</span>
                    <span className="stats-value">7일</span>
                  </div>
                  <div className="stats-row">
                    <span className="stats-label">서재에 담은 사람</span>
                    <span className="stats-value">1.2K명</span>
                  </div>
                  <div className="stats-row">
                    <span className="stats-label">작성된 리뷰</span>
                    <span className="stats-value">128개</span>
                  </div>
                </div>
              </div>
            </div>
          }
        </section>

        {/* Middle: Reviews Section */}
        <section className="reviews-section">
          <div className="reviews-header">
            <h2>리뷰 128개</h2>
            <div className="reviews-actions">
              <select className="sort-dropdown">
                <option>최신순</option>
                <option>인기순</option>
                <option>별점 높은순</option>
              </select>
              <button className="btn-write-review-small">리뷰 쓰기</button>
            </div>
          </div>

          <div className="reviews-list">
            {[1, 2, 3].map((item) => (
              <div key={item} className="review-card">
                <div className="review-user-info">
                  <div className="avatar-placeholder"></div>
                  <div className="user-details">
                    <span className="user-name">독서광_{item}</span>
                    <span className="user-rating">★★★★★</span>
                  </div>
                  <span className="review-date">2025.03.0{item}</span>
                </div>
                <div className="review-content">
                  <p>
                    정말 따뜻하고 마음이 몽글몽글해지는 소설입니다. 각자의 사연을 가진 사람들이
                    편의점이라는 공간에서 만나 서로 위로를 주고받는 모습이 인상 깊었어요.
                    강력 추천합니다!
                  </p>
                </div>
                <div className="review-footer">
                  <button className="btn-like">👍 1{item}</button>
                  <button className="btn-comment">💬 2</button>
                  <span className="btn-report">신고</span>
                </div>
              </div>
            ))}
          </div>

          <button className="btn-load-more">더보기</button>
        </section>

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
