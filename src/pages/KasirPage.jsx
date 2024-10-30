import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const KasirPage = () => {
  const [cart, setCart] = useState([])
  const [customerName, setCustomerName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('belum')

  const menuItems = {
    makanan: [
      { id: 1, name: 'Telur Gulung', price: 1000 },
      { id: 2, name: 'Kentang Goreng Small', price: 5000 },
      { id: 3, name: 'Kentang Goreng Large', price: 10000 },
      { id: 4, name: 'Nugget', price: 10000 },
      { id: 5, name: 'Kaget', price: 15000 },
      { id: 6, name: 'Popcorn', price: 10000 },
    ],
    minuman: [
      { id: 7, name: 'Tea', price: 3000 },
      { id: 8, name: 'Milk Tea', price: 5000 },
      { id: 9, name: 'Teh Bunga', price: 6000 },
    ]
  }

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id)
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ))
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId)
      return
    }
    setCart(cart.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleSaveOrder = async () => {
    if (!customerName) {
      toast.error('Mohon isi nama customer!', {
        position: 'bottom-left',
        style: {
          background: '#1F2937',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      })
      return
    }

    if (cart.length === 0) {
      toast.error('Keranjang masih kosong!', {
        position: 'bottom-left',
        style: {
          background: '#1F2937',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      })
      return
    }

    setIsLoading(true)
    try {
      const menuString = cart.map(item => 
        `${item.name} (${item.quantity}x @ Rp${formatRupiah(item.price)})`
      ).join('\n')

      const totalJumlah = cart.reduce((sum, item) => sum + item.quantity, 0)

      const totalHarga = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      const orderData = {
        nama: customerName,
        menu: menuString,
        jumlah: totalJumlah,
        total: totalHarga,
        subtotal: totalHarga,
        tanggal: new Date().toISOString().split('T')[0],
        jenis_pembayaran: paymentMethod,
        delivered: false
      }

      console.log('Data yang akan dikirim:', orderData)
      
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      const response = await axios.post(`${API_URL}/api/htrans/order`, orderData)
      
      if (response.status === 201) {
        toast.success('Pesanan berhasil disimpan!', {
          position: 'bottom-left',
          style: {
            background: '#065F46',
            color: '#fff',
            padding: '16px',
            borderRadius: '10px',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#065F46',
          },
        })
        setCart([])
        setCustomerName('')
        setPaymentMethod('belum')
      }
    } catch (error) {
      toast.error(`Gagal menyimpan pesanan: ${error.response?.data?.message || error.message}`, {
        position: 'bottom-left',
        style: {
          background: '#1F2937',
          color: '#fff',
          padding: '16px',
          borderRadius: '10px',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Fungsi helper untuk memformat angka ke format Rupiah
  const formatRupiah = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Tambahkan validasi untuk tombol
  const isButtonDisabled = !customerName || cart.length === 0 || isLoading;

  return (
    <div className="pt-16 flex flex-col md:flex-row p-2 md:p-4 gap-4 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-white transition-colors">
      <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-4 rounded-lg flex flex-col h-[calc(100vh-5rem)] shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-900 dark:text-white">Detail Pesanan</h2>
        <input
          type="text"
          placeholder="Nama Customer"
          className="w-full p-2 mb-4 bg-gray-50 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        
        <div className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 p-2 rounded-t-lg border border-blue-200 dark:border-blue-800">
          <div className="grid grid-cols-4 md:grid-cols-5 font-bold text-xs md:text-sm">
            <div>Produk</div>
            <div>Harga</div>
            <div>Jumlah</div>
            <div className="hidden md:block">Subtotal</div>
            <div>Aksi</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto scrollbar-hide">
          {cart.map(item => (
            <div 
              key={item.id} 
              className="grid grid-cols-4 md:grid-cols-5 items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
            >
              <div>{item.name}</div>
              <div>Rp {formatRupiah(item.price)}</div>
              <div>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-12 md:w-16 bg-gray-700 p-1 rounded"
                  min="1"
                />
              </div>
              <div className="hidden md:block">Rp {formatRupiah(item.price * item.quantity)}</div>
              <div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 md:h-6 md:w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-4 gap-2 mt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white">
            Total: Rp {formatRupiah(total)}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm"
            >
              <option value="belum">Belum Bayar</option>
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer</option>
            </select>
            <button
              className={`px-4 py-2 rounded text-sm font-medium ${
                isButtonDisabled
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={handleSaveOrder}
              disabled={isButtonDisabled}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Pesanan'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-[calc(100vh-5rem)] overflow-auto scrollbar-hide bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg md:text-xl font-bold mb-4 text-center text-gray-900 dark:text-white sticky top-0 bg-white dark:bg-gray-800 py-2">Menu</h2>
        
        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-200 dark:border-gray-700" />
          <h3 className="text-base md:text-lg font-bold px-4 text-center text-gray-800 dark:text-white">Makanan</h3>
          <hr className="flex-grow border-gray-200 dark:border-gray-700" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {menuItems.makanan.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="relative bg-white dark:bg-gray-800 p-3 rounded-[2rem] text-center border-2 border-transparent 
              hover:border-blue-500 dark:hover:border-blue-400 
              hover:shadow-xl dark:hover:shadow-blue-900/30
              transform hover:-translate-y-1 
              transition-all duration-200 ease-in-out 
              overflow-hidden group
              before:content-[''] before:absolute before:inset-0 
              before:bg-gradient-to-br before:from-blue-50 before:to-transparent 
              before:rounded-[2rem] before:opacity-0 before:group-hover:opacity-100 
              before:transition-opacity before:duration-200
              after:content-[''] after:absolute after:inset-0 
              after:bg-gradient-to-tl after:from-transparent after:to-blue-50/50
              after:rounded-[2rem] after:opacity-0 after:group-hover:opacity-100 
              after:transition-opacity after:duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 
                dark:from-blue-900/20 dark:to-blue-800/20 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 rounded-[2rem]">
              </div>

              <div className="relative z-10 p-2">
                <div className="font-bold text-[10px] md:text-base truncate text-gray-900 dark:text-white 
                  group-hover:text-blue-600 dark:group-hover:text-blue-400 
                  transform group-hover:scale-105 
                  transition-all duration-200">
                  {item.name}
                </div>
                
                <div className="text-blue-600 dark:text-blue-400 text-[10px] md:text-base font-medium 
                  group-hover:text-blue-700 dark:group-hover:text-blue-300 
                  transform group-hover:scale-105 
                  transition-all duration-200 mt-1">
                  Rp {formatRupiah(item.price)}
                </div>

                <div className="mt-3 text-blue-500 dark:text-blue-400 
                  group-hover:text-blue-600 dark:group-hover:text-blue-300
                  bg-blue-50 dark:bg-blue-900/30 rounded-full p-2
                  transform group-hover:scale-110 
                  transition-all duration-200">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 md:h-6 md:w-6 mx-auto" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 bg-blue-500 dark:bg-blue-400 
                opacity-0 group-active:opacity-10 
                transition-opacity duration-200 rounded-[2rem]">
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center mb-4">
          <hr className="flex-grow border-gray-200 dark:border-gray-700" />
          <h3 className="text-base md:text-lg font-bold px-4 text-center text-gray-800 dark:text-white">
            Minuman
          </h3>
          <hr className="flex-grow border-gray-200 dark:border-gray-700" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {menuItems.minuman.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="relative bg-white dark:bg-gray-800 p-3 rounded-[2rem] text-center border-2 border-transparent 
              hover:border-blue-500 dark:hover:border-blue-400 
              hover:shadow-xl dark:hover:shadow-blue-900/30
              transform hover:-translate-y-1 
              transition-all duration-200 ease-in-out 
              overflow-hidden group
              before:content-[''] before:absolute before:inset-0 
              before:bg-gradient-to-br before:from-blue-50 before:to-transparent 
              before:rounded-[2rem] before:opacity-0 before:group-hover:opacity-100 
              before:transition-opacity before:duration-200
              after:content-[''] after:absolute after:inset-0 
              after:bg-gradient-to-tl after:from-transparent after:to-blue-50/50
              after:rounded-[2rem] after:opacity-0 after:group-hover:opacity-100 
              after:transition-opacity after:duration-200"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 
                dark:from-blue-900/20 dark:to-blue-800/20 
                opacity-0 group-hover:opacity-100 
                transition-opacity duration-200 rounded-[2rem]">
              </div>

              <div className="relative z-10 p-2">
                <div className="font-bold text-[10px] md:text-base truncate text-gray-900 dark:text-white 
                  group-hover:text-blue-600 dark:group-hover:text-blue-400 
                  transform group-hover:scale-105 
                  transition-all duration-200">
                  {item.name}
                </div>
                
                <div className="text-blue-600 dark:text-blue-400 text-[10px] md:text-base font-medium 
                  group-hover:text-blue-700 dark:group-hover:text-blue-300 
                  transform group-hover:scale-105 
                  transition-all duration-200 mt-1">
                  Rp {formatRupiah(item.price)}
                </div>

                <div className="mt-3 text-blue-500 dark:text-blue-400 
                  group-hover:text-blue-600 dark:group-hover:text-blue-300
                  bg-blue-50 dark:bg-blue-900/30 rounded-full p-2
                  transform group-hover:scale-110 
                  transition-all duration-200">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 md:h-6 md:w-6 mx-auto" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                    />
                  </svg>
                </div>
              </div>

              <div className="absolute inset-0 bg-blue-500 dark:bg-blue-400 
                opacity-0 group-active:opacity-10 
                transition-opacity duration-200 rounded-[2rem]">
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KasirPage