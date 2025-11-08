import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Anasayfa from './pages/Anasayfa.tsx'
import Giris from './pages/auth/giris.tsx'
import Kayit from './pages/auth/kayit.tsx'
import Atik from './pages/admin/ZiraatDasboard/atik.tsx'
import ZiraatDash from './pages/admin/ZiraatDasboard/ZiraatDash.tsx'
import UrunOnay from './pages/admin/ZiraatDasboard/UrunOnay.tsx'
import CiftlikOnay from './pages/admin/ZiraatDasboard/CiftlikOnay.tsx'
import DasSanayi from './pages/admin/SanayiDasboard/das_sanayi.tsx'
import Firmalar from './pages/firma/firmalar.tsx'
import FirmaDetay from './pages/firma/firma_detay.tsx'
import FirmaSatisGecmisi from './pages/firma/firma_satis_gecmisi.tsx'
import FirmaEkle from './pages/firma/firma_ekle.tsx'
import Ciftlikler from './pages/ciftlik/ciftlikler.tsx'
import Ciftlik from './pages/ciftlik/ciftlik.tsx'
import CiftlikEkle from './pages/ciftlik/ciftlik_ekle.tsx'
import Atiklar from './pages/atiklar.tsx'
import AtikEkle from './pages/ciftlik/atik_ekle.tsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Anasayfa />} />
        <Route path="/giris" element={<Giris />} />
        <Route path="/kayit" element={<Kayit />} />
        <Route path="/admin/atik" element={<Atik />} />
        <Route path="/admin/ziraat" element={<ZiraatDash />} />
        <Route path="/admin/ziraat/urun-onay" element={<UrunOnay />} />
        <Route path="/admin/ziraat/ciftlik-onay" element={<CiftlikOnay />} />
        <Route path="/admin/sanayi" element={<DasSanayi />} />
        <Route path="/ciftlikler" element={<Ciftlikler />} />
        <Route path="/ciftlik" element={<Ciftlik />} />
        <Route path="/firmalar" element={<Firmalar />} />
        <Route path="/firma/detay" element={<FirmaDetay />} />
        <Route path="/firma/satis-gecmisi" element={<FirmaSatisGecmisi />} />
        <Route path="/firma/ekle" element={<FirmaEkle />} />
        <Route path="/ciftlik/ekle" element={<CiftlikEkle />} />
        <Route path="/atiklar" element={<Atiklar />} />
        <Route path="/atiklar/ekle" element={<AtikEkle />} />
      </Routes>
    </Router>
  )
}

export default App
