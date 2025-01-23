import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import KasirPage from './pages/KasirPage'
import RiwayatPage from './pages/RiwayatPage'
import Login from './pages/Login'
import Register from './pages/Register'

// Komponen untuk protected route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/login" />
  }
  
  return children
}

// Komponen Layout untuk menangani Navbar
const Layout = ({ children }) => {
  const location = useLocation()
  const isAuthPage = ['/login', '/register'].includes(location.pathname)

  return (
    <>
      {!isAuthPage && <Navbar />}
      {children}
    </>
  )
}

function App() {
  // Tambahkan useEffect untuk set dark mode
  useEffect(() => {
    // Set dark mode secara default
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <BrowserRouter>
      <Layout>
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
        
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/kasir" 
            element={
              <ProtectedRoute>
                <KasirPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/riwayat" 
            element={
              <ProtectedRoute>
                <RiwayatPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <KasirPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
