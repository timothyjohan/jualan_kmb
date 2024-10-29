import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import KasirPage from './pages/KasirPage'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<KasirPage />} />
          <Route path="/kasir" element={<KasirPage />} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  )
}

export default App
