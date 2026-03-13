import { Link } from 'react-router-dom';
import './Sidebar.css'

function Sidebar() {
    return (
        <div className='side-bar'>
            <div className='side-bar-menu'>
                <h1 className="side-bar-items">📖 Book Shelf</h1>
                <hr className="side-bar-divider" />
                <Link to='/' className="side-bar-items">홈</Link>
                <Link to='/search' className="side-bar-items">도서 검색</Link>
                <Link to='/library' className="side-bar-items">내 서재</Link>
                <Link to='/' className="side-bar-items">독서 통계</Link>
                <Link to='/' className="side-bar-items">커뮤니티</Link>
                <Link to='/' className="side-bar-items">프로필</Link>
                <div className="side-bar-items">
                    <img alt='프로필 사진' />
                    <div className='side-bar-items-profile-info'>
                        <p>수딩크림</p>
                        <p>SeoSooRyeon@gmail.com</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;