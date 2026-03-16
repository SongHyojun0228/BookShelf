import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import Sidebar from '../../components/layout/Sidebar';
import Addbookmodal from '../../components/modal/Addbookmodal';
import '../../App.css'
import './Searchpage.css'

export const MOCK_CATEGORIES = ['전체', '소설', '자기계발', '과학', '역사', '경제', '에세이', '인문'];

function Searchpage() {

    const [keyword, setKeyword] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [isModalOn, setIsModalOn] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [ref, inView] = useInView();
    const [selectedBook, setSelectedBook] = useState<any>(null);

    useEffect(() => {
        // 센서가 무언가를 감지했고(inView), 로딩 중이 아니고, 화면에 이미 책이 있을 때
        if (inView && !isLoading && searchResults.length > 0) {
            setPage(prev => prev + 1);
        }
    }, [inView, isLoading, searchResults.length]);

    useEffect(() => {
        if (page > 1) {
            fetchBooks(page, false); // false = 기존 목록 유지하면서 이어붙이기
        }
    }, [page]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!keyword.trim()) return;

        setPage(1);
        fetchBooks(1, true); // true = 기존 목록을 지우고 새로 덮어쓰기
    }

    const fetchBooks = async (pageNum: number, isNewSearch: boolean = false) => {
        setIsLoading(true);

        try {
            const ttbKey = 'ttbhyojun230011523001';
            const url = `/aladin-api/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${keyword}&QueryType=Keyword&MaxResults=30&start=${pageNum}&SearchTarget=Book&output=js&Version=20131101&OptResult=itemPage`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.item) {
                if (isNewSearch) { // 새로운 검색 
                    setSearchResults(data.item);
                } else { // 더보기(무한스크롤)면 기존 배열 뒤에 새 배열(data.item) 합치기
                    setSearchResults(prev => [...prev, ...data.item]);
                }
            } else {
                setSearchResults([]);
            }

            setIsLoading(true);
        } catch (error) {
            console.log("검색 중 오류(알라딘 API) : ", error);
        } finally {
            setIsLoading(false);
        }
    }


    return (
        <div className='total-page'>
            <Sidebar />

            {isModalOn ? <Addbookmodal onClose={() => setIsModalOn(false)} book={selectedBook} /> : null}

            <div className='main-page search-page'>
                <header className="search-header">
                    <div className="search-header-text">
                        <h1>도서 검색</h1>
                        <p>Google Books에서 전 세계 도서를 검색하세요</p>
                    </div>
                </header>

                <div className="search-section">
                    <form className="search-form" onSubmit={handleSearch}>
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                placeholder='책 제목, 저자, ISBN으로 검색...'
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="search-btn">{isLoading ? '검색 중..' : '검색'}</button>
                    </form>

                    <div className="category-filters">
                        {MOCK_CATEGORIES.map((category, index) => (
                            <button
                                key={index}
                                className={`category-btn ${index === 0 ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="search-results-section">
                    <p className="search-results-count">검색 결과 · {searchResults.length}건</p>

                    <div className="search-results-list">
                        {searchResults.filter((book: any) => {
                            if (selectedCategory === '전체') return true;
                            return book.categoryName && book.categoryName.includes(selectedCategory);
                        }).map((book: any) => (
                            <div key={book.itemId} className="search-result-card">
                                <div className="book-cover">
                                    {book.cover ? (
                                        <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%' }} />
                                    ) : (
                                        <span className="no-image">이미지 없음</span>
                                    )}
                                </div>
                                <div className="book-info">
                                    <h2 className="book-title">{book.title}</h2>
                                    <p className="book-author">{book.author}</p>
                                    <p className="book-meta">{book.pubDate.substring(0, 4)} · {book.publisher}</p>
                                    <p className="book-rating">⭐ {book.customerReviewRank}</p>
                                </div>
                                <div className="book-actions">
                                    <button className="btn-add-library" onClick={() => { setIsModalOn(true); setSelectedBook(book) }}>서재에 담기</button>
                                    <button className="btn-view-details">상세 보기</button>
                                </div>
                            </div>
                        ))}

                        <div ref={ref} style={{ height: '50px', backgroundColor: 'transparent' }}>
                            {/* 바닥에 닿았을 때 로딩 중 표시 (선택사항) */}
                            {isLoading && <p style={{ textAlign: 'center' }}>책을 더 불러오는 중입니다...</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Searchpage;