import Sidebar from '../../components/layout/Sidebar';
import './Homepage.css'

export const MOCK_REVIEWS = [
    {
        id: 1,
        nickname: '수딩크림',
        bookName: '수딩크림을 바르다',
        review: '수딩크림 리뷰',
        avatarUrl: ''
    },
    {
        id: 2,
        nickname: '독서왕',
        bookName: '역행자',
        review: '자기계발서 중에 가장 현실적인 조언이 담긴 책....',
        avatarUrl: ''
    },
    {
        id: 3,
        nickname: '감자조림',
        bookName: '불편한 편의점',
        review: '따뜻한 이야기. 편의점이 배경이라 더 친근하게 느껴졌다...',
        avatarUrl: ''
    },
    {
        id: 4,
        nickname: '책벌레',
        bookName: '파친코',
        review: '시대를 관통하는 강렬한 서사에 푹 빠져서 주말 내내 읽었습니다.',
        avatarUrl: ''
    }
];

function HomePage() {
    return (
        <div className='total-page'>
            <Sidebar />
            <div className='main-page home-page'>
                <h1>홈</h1>
                <div className='goal-of-month'>
                    <h2>이번 달 목표 : 4권 중 4권 달성</h2>
                    <p>50%달성 / 이번 달 남은 기간 15일</p>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: '50%' }}></div>
                    </div>
                </div>
                <div className='recent-reviews'>
                    {MOCK_REVIEWS.map((review, index) =>
                        <div key={index} className='recent-review-items'>
                            <img alt='프로필사진'></img>
                            <p className='recent-review-items-nickname'>{review.nickname}</p>
                            <p className='recent-review-items-book-name'>{review.bookName}</p>
                            <p className='recent-review-items-reivew'>{review.review}</p>
                        </div>)
                    }
                </div>
            </div>
        </div>
    )
}

export default HomePage;