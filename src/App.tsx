import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar'
import Footer from './components/footer'
import Anasayfa from './pages/Anasayfa'
import Giris from './pages/auth/giris'
import Kayit from './pages/auth/kayit'

function App() {
  return (
    <Router>
      <Routes>
        {/* Ana sayfa - navbar ve footer ile */}
        <Route path="/" element={
          <div className="flex flex-col min-h-screen w-full">
            <Navbar />
            <main className="flex-grow w-full">
              <Anasayfa />
            </main>
            <Footer />
          </div>
        } />
        
        {/* Giriş sayfası - sadece içerik */}
        <Route path="/giris" element={<Giris />} />
        
        {/* Kayıt sayfası - sadece içerik */}
        <Route path="/kayit" element={<Kayit />} />
      </Routes>
    </Router>
  )
}

export default App
