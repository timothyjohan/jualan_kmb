import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import KasirPage from './pages/KasirPage'
import RiwayatPage from './pages/RiwayatPage'

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-left"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Durasi default 3 detik
          duration: 3000,
          
          // Styling default
          style: {
            background: '#1F2937',
            color: '#fff',
            padding: '16px',
            borderRadius: '10px',
          },

          // Konfigurasi untuk setiap tipe toast
          success: {
            style: {
              background: '#065F46',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#065F46',
            },
          },

          error: {
            style: {
              background: '#1F2937',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
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
