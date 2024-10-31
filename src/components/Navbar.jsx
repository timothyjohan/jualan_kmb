import { Link } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 flex justify-between items-center transition-colors shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">Sistem Kasir</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/kasir" className="hover:text-gray-600 dark:hover:text-gray-300">Kasir</Link>
        <Link to="/riwayat" className="hover:text-gray-600 dark:hover:text-gray-300">Riwayat Pesanan</Link>
        <ThemeToggle />
      </div>
    </nav>
  )
}

export default Navbar