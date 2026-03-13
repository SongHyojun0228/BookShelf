import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/home/HomePage'
import Searchpage from './pages/search/Searchpage';
import Myshelf from './pages/my-shelf/Myshelf';
import './App.css'
import './index.css'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<Searchpage />} />
        <Route path="/library" element={<Myshelf />} />
      </Routes>
    </>
  )
}

export default App
