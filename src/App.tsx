import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage'
import Searchpage from './pages/search/Searchpage';
import Myshelf from './pages/my-shelf/Myshelf';
import Community from './pages/community/Community';
import BookDetail from './pages/book-detail/BookDetail';
import './App.css'
import './index.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Searchpage />} />
        <Route path="/library" element={<Myshelf />} />
        <Route path="/community" element={<Community />} />
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>
    </>
  )
}

export default App
