import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import KasirPage from './pages/KasirPage'
import RiwayatPage from './pages/RiwayatPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/kasir" element={<KasirPage />} />
        <Route path="/riwayat" element={<RiwayatPage />} />
        <Route path="/" element={<KasirPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
