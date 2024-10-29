import { useState } from 'react'
import axios from 'axios'

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
      alert('Mohon isi nama customer!')
      return
    }

    if (cart.length === 0) {
      alert('Keranjang masih kosong!')
      return
    }

    setIsLoading(true)
    try {
      const orderData = {
        customer_name: customerName,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity
        })),
        total_amount: total,
        payment_method: paymentMethod,
        order_date: new Date().toISOString()
      }

      const response = await axios.post('http://localhost:3000/api/orders', orderData)
      
      if (response.status === 201 || response.status === 200) {
        alert('Pesanan berhasil disimpan!')
        // Reset form
        setCart([])
        setCustomerName('')
      }
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Gagal menyimpan pesanan: ' + error.message)
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
    <div className="flex p-4 gap-4 bg-gray-900 h-[calc(100vh-64px)] text-white">
      <div className="w-1/2 bg-gray-800 p-4 rounded-lg flex flex-col h-fit">
        <h2 className="text-xl font-bold mb-2">Detail Pesanan</h2>
        <input
          type="text"
          placeholder="Nama Customer"
          className="w-full p-2 mb-2 bg-gray-700 rounded"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        
        <div className="bg-blue-200 text-black p-2 rounded">
          <div className="grid grid-cols-5 font-bold text-sm">
            <div>Produk</div>
            <div>Harga</div>
            <div>Jumlah</div>
            <div>Subtotal</div>
            <div>Aksi</div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          {cart.map(item => (
            <div 
              key={item.id} 
              className="grid grid-cols-5 items-center py-2 border-b border-gray-700 text-sm"
            >
              <div>{item.name}</div>
              <div>Rp {formatRupiah(item.price)}</div>
              <div>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                  className="w-16 bg-gray-700 p-1 rounded"
                  min="1"
                />
              </div>
              <div>Rp {formatRupiah(item.price * item.quantity)}</div>
              <div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-2 gap-2">
          <div className="text-xl">Total: Rp {formatRupiah(total)}</div>
          <div className="flex items-center gap-2">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1 text-sm"
            >
              <option value="belum">Belum Bayar</option>
              <option value="tunai">Tunai</option>
              <option value="transfer">Transfer</option>
            </select>
            <button
              className={`px-4 py-2 rounded ${
                isButtonDisabled
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
              onClick={handleSaveOrder}
              disabled={isButtonDisabled}
              title={
                !customerName 
                  ? "Mohon isi nama customer"
                  : cart.length === 0 
                    ? "Keranjang masih kosong"
                    : ""
              }
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Pesanan'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-1/2 overflow-auto">
        <h2 className="text-xl font-bold mb-2 text-center">Menu</h2>
        
        <div className="flex items-center mb-2">
          <hr className="flex-grow border-gray-800" />
          <h3 className="text-lg font-bold px-4 text-center">Makanan</h3>
          <hr className="flex-grow border-gray-800" />
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          {menuItems.makanan.map(item => (
            <div key={item.id} className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="font-bold text-sm">{item.name}</div>
              <div className="text-blue-400 text-sm">Rp {formatRupiah(item.price)}</div>
              <button
                onClick={() => addToCart(item)}
                className="mt-2 text-blue-400 hover:text-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center mb-2">
          <hr className="flex-grow border-gray-800" />
          <h3 className="text-lg font-bold px-4 text-center">Minuman</h3>
          <hr className="flex-grow border-gray-800" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          {menuItems.minuman.map(item => (
            <div key={item.id} className="bg-gray-800 p-3 rounded-lg text-center">
              <div className="font-bold text-sm">{item.name}</div>
              <div className="text-blue-400 text-sm">Rp {formatRupiah(item.price)}</div>
              <button
                onClick={() => addToCart(item)}
                className="mt-2 text-blue-400 hover:text-blue-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default KasirPage