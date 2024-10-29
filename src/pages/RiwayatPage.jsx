import { useState, useEffect } from 'react'
import axios from 'axios'

const RiwayatPage = () => {
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [totalPenghasilan, setTotalPenghasilan] = useState(0)
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  const formatRupiah = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders')
      const allOrders = response.data
      
      const filteredOrders = allOrders.filter(order => {
        const orderDate = new Date(order.order_date).toISOString().split('T')[0]
        return orderDate === selectedDate
      })

      setOrders(filteredOrders)
      const total = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)
      setTotalPenghasilan(total)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [selectedDate])

  const handleDelete = async (orderId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        await axios.delete(`http://localhost:3000/api/orders/${orderId}`)
        fetchOrders()
      } catch (error) {
        console.error('Error deleting order:', error)
        alert('Gagal menghapus pesanan')
      }
    }
  }

  const handleUpdatePayment = async (orderId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/orders/${orderId}`, {
        payment_method: newStatus
      })
      fetchOrders()
    } catch (error) {
      console.error('Error updating payment status:', error)
      alert('Gagal mengupdate status pembayaran')
    }
  }

  return (
    <div className="pt-16 p-4 pb-8 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 sticky top-16 bg-gray-100 dark:bg-gray-900 z-10 py-2">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1 rounded border border-gray-300 dark:border-gray-700"
          />
        </div>
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2 w-full md:w-auto">
          <div className="text-gray-600 dark:text-gray-400">
            {new Date(selectedDate).toLocaleDateString('id-ID', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
          <div className="bg-green-800 text-white px-4 py-2 rounded">
            Total Penghasilan: Rp {formatRupiah(totalPenghasilan)}
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-14rem)] overflow-auto scrollbar-hide pb-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-8 text-center shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 14h.01M12 16h.01M12 18h.01M12 20h.01M12 22h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <div className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tidak ada pesanan
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              pada tanggal {new Date(selectedDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
            {orders.map(order => (
              <div key={order.id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="grid grid-cols-5 p-4 items-center">
                  <button
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 w-fit"
                  >
                    Detail
                  </button>
                  <div>{order.customer_name}</div>
                  <div>{formatDate(order.order_date)}</div>
                  <div>Rp {formatRupiah(order.total_amount)}</div>
                  <div className="flex gap-2">
                    <select
                      value={order.payment_method}
                      onChange={(e) => handleUpdatePayment(order.id, e.target.value)}
                      className={`rounded px-2 py-1 text-sm ${
                        order.payment_method === 'belum' 
                          ? 'bg-orange-500' 
                          : order.payment_method === 'tunai'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      } text-white`}
                    >
                      <option value="belum">Pending</option>
                      <option value="tunai">Tunai</option>
                      <option value="transfer">Transfer</option>
                    </select>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {selectedOrder?.id === order.id && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4">
                    <h3 className="font-bold mb-2">Detail Order</h3>
                    <div className="grid grid-cols-4 bg-gray-100 dark:bg-gray-600 p-2 rounded mb-2">
                      <div>Produk</div>
                      <div>Jumlah</div>
                      <div>Harga</div>
                      <div>Subtotal</div>
                    </div>
                    {order.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-4 border-b border-gray-200 dark:border-gray-600 py-1">
                        <div>{item.product_name}</div>
                        <div>{item.quantity}</div>
                        <div>Rp {formatRupiah(item.price)}</div>
                        <div>Rp {formatRupiah(item.subtotal)}</div>
                      </div>
                    ))}
                    <div className="text-right mt-2">
                      <span className="font-bold">Total: Rp {formatRupiah(order.total_amount)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default RiwayatPage 