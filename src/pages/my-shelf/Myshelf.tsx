import { useState } from 'react';
import Sidebar from '../../components/layout/Sidebar';
import Reviewmodal from '../../components/modal/Reviewmodal';
import '../../App.css';
import './Myshelf.css';

// [임시 데이터] 내 서재 책 목록
const MOCK_MY_BOOKS = [
    {
        id: 1,
        title: '불편한 편의점',
        author: '김호연',
        status: '읽는 중',
        progress: 90,
        currentPage: 235,
        totalPages: 237,
        tags: ['소설', '한국문학']
    },
    {
        id: 2,
        title: '역행자',
        author: '자청',
        status: '읽을 책',
        progress: 0,
        currentPage: 142,
        totalPages: 237,
        tags: ['자기계발', '한국문학']
    },
    {
        id: 3,
        title: '아토믹 해빗',
        author: '제임스 클리어',
        status: '읽은 책',
        progress: 100,
        currentPage: 142,
        totalPages: 237,
        tags: ['과학', '한국문학']
    }
];

const MOCK_CATEGORIES = ['전체', '자기계발', '소설', '과학', '에세이'];

function Myshelf() {
    const [selectedTab, setSelectedTab] = useState('읽는 중');
    const [selectedCategory, setSelectedCategory] = useState('전체');
    const [isReviewModalOn, setIsReviewModalOn] = useState(false);

    return (
        <div className='total-page'>
            <Sidebar />

            {isReviewModalOn ? <Reviewmodal onClose={() => setIsReviewModalOn(false)} /> : null}

            <div className='main-page myshelf-page'>
                <header className="myshelf-header">
                    <h1>내 서재</h1>
                    <p className="myshelf-subtitle">총 24권의 책이 있어요</p>
                </header>

                <div className="myshelf-tabs">
                    <button
                        className={`tab-btn ${selectedTab === '읽는 중' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('읽는 중')}
                    >
                        읽는 중 (3)
                    </button>
                    <button
                        className={`tab-btn ${selectedTab === '읽을 책' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('읽을 책')}
                    >
                        읽을 책 (12)
                    </button>
                    <button
                        className={`tab-btn ${selectedTab === '읽은 책' ? 'active' : ''}`}
                        onClick={() => setSelectedTab('읽은 책')}
                    >
                        읽은 책 (9)
                    </button>
                </div>

                <div className="myshelf-controls">
                    <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input placeholder='책 제목, 저자, ISBN으로 검색...' />
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
                    {MOCK_MY_BOOKS.filter((book) => {
                        if (selectedCategory === '전체') {
                            return true;
                        }
                        return selectedCategory === book.tags[0]
                    }).filter((book) => {
                        return selectedTab === book.status
                    })
                        .map((book) => (
                            <div key={book.id} className="myshelf-book-card">
                                <div className="card-top">
                                    <div className="book-cover">
                                        <span className="no-image">이미지<br />없음</span>
                                    </div>
                                    <div className="book-info">
                                        <h3 className="book-title">{book.title}</h3>
                                        <p className="book-author">{book.author}</p>
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

                                <div className="book-tags">
                                    {book.tags.map((tag, i) => (
                                        <span key={i} className="tag-pill">#{tag}</span>
                                    ))}
                                </div>

                                <div className="card-actions">
                                    <button className="btn-review" onClick={() => setIsReviewModalOn(true)}>리뷰 쓰기</button>
                                    <button className="btn-change-status">상태 변경</button>
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
        </div>
    );
}

export default Myshelf;
