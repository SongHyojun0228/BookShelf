import { useEffect, useState, useCallback } from 'react';
import Loading from '../../components/common/Loading';
import Sidebar from '../../components/layout/Sidebar';
import Reviewmodal from '../../components/modal/Reviewmodal';
import StatusModal from '../../components/modal/StatusModal';
import DeleteModal from '../../components/modal/DeleteModal';
import '../../App.css';
import './Myshelf.css';
import { supabase } from '../../supabase';


const MOCK_CATEGORIES = ['전체', '자기계발', '소설', '과학', '에세이'];

function Myshelf() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('읽는 중');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [isReviewModalOn, setIsReviewModalOn] = useState(false);
    const [isStatusModalOn, setIsStatusModalOn] = useState(false);
    const [isDeleteModalOn, setIsDeleteModalOn] = useState(false);
    const [myBooks, setMyBooks] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');

    const UUID = '6a5f62b1-fc4a-4068-9b01-760d8a1fd597';

    const [totalBook, setTotalBook] = useState(0);
    const [willReadBook, setWillReadBook] = useState(0);
    const [readingBook, setReadingBook] = useState(0);
    const [readBook, setReadBook] = useState(0);
    const [selectedBook, setSelectedBook] = useState<any>(null);
    const [selectedLibraryItem, setSelectedLibraryItem] = useState<any>(null);

    const listMyBooks = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error }
                = await supabase.from('MyLibrary')
                    .select(`
                    *,
                    Books (
                        *
                    )
                `)
                    .eq('user_id', UUID);

            if (error) throw error;

            if (data) {
                const { data: reviewData } =
                    await supabase.from('Reviews')
                        .select('book_id')
                        .eq('user_id', UUID);

                const reviewedBookIds = new Set(reviewData?.map(r => r.book_id) || []);

                // progress 계산로직 (DB에 없을 경우 대비)
                const processedData = data.map((item: any) => ({
                    ...item,
                    progress: item.Books?.total_pages > 0
                        ? Math.round((item.current_page / item.Books.total_pages) * 100)
                        : 0,
                    currentPage: item.current_page,
                    totalPages: item.Books?.total_pages || 0,
                    isReviewed: reviewedBookIds.has(item.book_id)
                }));
                setMyBooks(processedData);
                setTotalBook(processedData.length);

                // 각 상태별 카운트 계산
                setWillReadBook(processedData.filter(b => b.status === '읽을 예정').length);
                setReadingBook(processedData.filter(b => b.status === '읽는 중').length);
                setReadBook(processedData.filter(b => b.status === '읽음').length);
            }

            console.log("불러온 데이터 : ", data);
        } catch (error) {
            console.log("내 서재 불러오기 에러 : ", error);
        } finally {
            setIsLoading(false);
        }
    }, [UUID]);

    useEffect(() => {
        listMyBooks();
    }, [listMyBooks]);

    return (
        <div className='total-page'>
            <Sidebar />

            {isReviewModalOn ? <Reviewmodal onClose={() => setIsReviewModalOn(false)} book={selectedBook} onSuccess={listMyBooks} /> : null}
            {isStatusModalOn && selectedLibraryItem ? <StatusModal onClose={() => setIsStatusModalOn(false)} libraryItem={selectedLibraryItem} /> : null}
            {isDeleteModalOn && selectedBook ? (
                <DeleteModal
                    onClose={() => setIsDeleteModalOn(false)}
                    book={selectedBook}
                />
            ) : null}

            <div className='main-page myshelf-page'>
                <header className="myshelf-header">
                    <h1>내 서재</h1>
                    <p className="myshelf-subtitle">총 {totalBook}권의 책이 있어요</p>
                </header>

                <div className="myshelf-tabs">
                    <button
                        className={`tab-btn ${selectedTab === '읽는 중' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('읽는 중')}
                    >
                        읽는 중 ({readingBook})
                    </button>
                    <button
                        className={`tab-btn ${selectedTab === '읽을 예정' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('읽을 예정')}
                    >
                        읽을 예정 ({willReadBook})
                    </button>
                    <button
                        className={`tab-btn ${selectedTab === '읽음' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('읽음')}
                    >
                        읽음 ({readBook})
                    </button>
                </div>

                <div className="myshelf-controls">
                    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input placeholder='책 제목, 저자, ISBN으로 검색...' value={inputText} onChange={(e) => setInputText(e.target.value)} />
                        </div>
                    </form>

                    <div className="category-filters">
                        {MOCK_CATEGORIES.map((category, index) => (
                            <button
                                key={index}
                                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="myshelf-book-grid">
                    {isLoading ? <div style={{ marginTop: '50px' }}>
                        <Loading text="내 서재" />
                    </div> : myBooks.filter((book => {
                        return book.Books.title.includes(inputText) || book.Books.author.includes(inputText) || book.Books.publisher.includes(inputText);
                    }))
                        .filter((book) => {
                            if (selectedCategory === '전체') {
                                return true;
                            }
                            return book.Books.genre.includes(selectedCategory);
                        }).filter((book) => {
                            return selectedTab === book.status
                        })
                        .map((book) => (
                            <div key={book.mylibrary_id} className="myshelf-book-card">
                                <div className="card-top">
                                    <div className="book-cover">
                                        <img src={book.Books?.img} alt={book.Books?.title} style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <div className="book-info">
                                        <h3 className="book-title">{book.Books?.title}</h3>
                                        <p className="book-author">{book.Books?.author}</p>
                                        <p className="book-genre">{book.Books?.genre}</p>
                                        <p className="book-publisher">{book.Books?.publisher}</p>
                                        <span className="status-badge">{book.status}</span>

                                        <div className="progress-section">
                                            <div className="progress-labels">
                                                <span>진행률</span>
                                            </div>
                                            <div className="progress-bar-container">
                                                <div className="progress-bar" style={{ width: `${book.progress}%` }}></div>
                                            </div>
                                            <p className="progress-text">{book.progress}% · {book.currentPage}/{book.totalPages} 페이지</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-actions">
                                    {book.isReviewed ? (
                                        <button className="btn-edit-review" onClick={() => {
                                            setIsReviewModalOn(true);
                                            setSelectedBook(book.Books);
                                        }}>
                                            리뷰 수정
                                        </button>
                                    ) : (
                                        <button className="btn-review" onClick={() => {
                                            setIsReviewModalOn(true);
                                            setSelectedBook(book.Books);
                                        }}>리뷰 쓰기</button>
                                    )}

                                    <button className="btn-change-status" onClick={() => {
                                        setSelectedLibraryItem(book);
                                        setIsStatusModalOn(true);
                                    }}>상태 변경</button>

                                    <button className="btn-delete" onClick={() => {
                                        setSelectedLibraryItem(book);
                                        setIsDeleteModalOn(true);
                                    }}>
                                        삭제
                                    </button>
                                </div>

                            </div>
                        ))}
                </div>

                <div className="myshelf-stats-container">
                    <div className="stat-item">
                        <p className="stat-title">이번 달 독서량</p>
                        <p className="stat-value">2권</p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-title">평균 완독기간</p>
                        <p className="stat-value">12일</p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-title">가장 많이 읽은 장르</p>
                        <p className="stat-value">소설</p>
                    </div>
                    <div className="stat-item">
                        <p className="stat-title">연간 목표 달성률</p>
                        <p className="stat-value">50%</p>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Myshelf;
