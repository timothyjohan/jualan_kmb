import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast' // Import toast

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
    // Convert to UTC+7
    const utc7Date = new Date(date.getTime() + 0 * 60 * 60 * 1000)
    return utc7Date.toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).replace(/:/g, '.')
  }

  const fetchOrders = async () => {
    try {
      const date = new Date(selectedDate)
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      
      const API_URL = import.meta.env.VITE_API_URL
      
      const response = await axios.get(`${API_URL}/api/htrans/get/${formattedDate}`)
      setOrders(response.data.htrans)
      
      const totalPaid = response.data.htrans
        .filter(order => order.jenis_pembayaran !== 'belum')
        .reduce((sum, order) => sum + order.subtotal, 0)
      
      setTotalPenghasilan(totalPaid)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [selectedDate])

  const handleDelete = async (orderId) => {
    toast((t) => (
      <div className="fixed inset-0 flex items-center justify-center z-[9999]" onClick={(e) => e.stopPropagation()}>
        <div className="fixed inset-0 bg-black bg-opacity-30" />
        
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-lg shadow-xl w-80 z-[10000]">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">
            Hapus pesanan ini?
          </h3>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                toast.dismiss(t.id);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg transition-all duration-200
                hover:bg-gray-500 hover:shadow-lg
                active:bg-gray-700 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              onClick={async () => {
                try {
                  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
                  const response = await axios.delete(`${API_URL}/api/htrans/delete/${orderId}`);
                  
                  if (response.status === 200) {
                    toast.success('Pesanan berhasil dihapus', {
                      position: "bottom-left",
                      style: {
                        background: '#065F46',
                        color: '#fff',
                      },
                    });
                    fetchOrders(); // Refresh data setelah berhasil hapus
                  }
                } catch (error) {
                  toast.error('Gagal menghapus pesanan', {
                    position: "bottom-left",
                    style: {
                      background: '#991B1B',
                      color: '#fff',
                    },
                  });
                } finally {
                  toast.dismiss(t.id); // Tutup dialog setelah proses selesai
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg transition-all duration-200
                hover:bg-red-500 hover:shadow-lg
                active:bg-red-700 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    ), {
      duration: Infinity,
      position: "center",
      style: {
        background: 'transparent',
        boxShadow: 'none',
        width: '100vw',
        height: '100vh',
        maxWidth: 'none',
        padding: 0,
      },
    });
  };

  const handleUpdatePayment = async (orderId, jenis_pembayaran) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.put(`${API_URL}/api/htrans/bayar/${orderId}`, {
        jenis_pembayaran
      });
      fetchOrders();
      toast.success('Status pembayaran berhasil diupdate!', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    } catch (error) {
      toast.error('Gagal mengupdate status pembayaran', {
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      })
    }
  }

  const handleUpdateDelivered = async (orderId, menuName) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      await axios.put(`${API_URL}/api/htrans/delivered/${orderId}`, {
        menu_name: menuName
      });
      fetchOrders();
    } catch (error) {
      console.error('Error updating delivered status:', error);
      alert('Gagal mengupdate status delivered');
    }
  };

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
            Total Penghasilan (Dibayar): Rp {formatRupiah(totalPenghasilan)}
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
            <div className="grid grid-cols-6 p-4 bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-white font-bold border-b border-gray-200 dark:border-gray-700 text-center">
              <div>Detail Order</div>
              <div>Nama Customer</div>
              <div>Tanggal</div>
              <div>Total</div>
              <div>Pembayaran</div>
              <div>Delivered</div>
            </div>

            {orders.map(order => (
              <div key={order._id} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div className="grid grid-cols-6 p-4 items-center text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => setSelectedOrder(selectedOrder?._id === order._id ? null : order)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Detail
                    </button>
                  </div>
                  <div>{order.nama}</div>
                  <div>{formatDate(order.createdAt)}</div>
                  <div>Rp {formatRupiah(order.subtotal)}</div>
                  <div className="flex justify-center gap-2">
                    <select
                      value={order.jenis_pembayaran}
                      onChange={(e) => handleUpdatePayment(order._id, e.target.value)}
                      className={`rounded px-2 py-1 text-sm ${
                        order.jenis_pembayaran == "pending" 
                          ? 'bg-orange-500' 
                          : order.jenis_pembayaran === 'tunai'
                          ? 'bg-green-500'
                          : 'bg-blue-500'
                      } text-white`}
                    >
                      <option value="pending">Pending</option>
                      <option value="tunai">Tunai</option>
                      <option value="transfer">Transfer</option>
                    </select>
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div>
                    <button
                      onClick={() => handleUpdateDelivered(order._id, order.menu)}
                      className={`px-3 py-1 rounded text-white ${
                        order.delivered ? 'bg-green-500' : 'bg-gray-500'
                      }`}
                    >
                      {order.delivered ? 'Delivered' : 'Not Delivered'}
                    </button>
                  </div>
                </div>

                {selectedOrder?._id === order._id && (
                  <div className="bg-white dark:bg-gray-800 p-4 mx-4 rounded-lg shadow-lg">
                    {/* Card Header */}
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-t-lg p-4">
                      <h3 className="text-xl text-blue-400">Detail Order</h3>
                    </div>

                    {/* Card Content */}
                    <div className="bg-white dark:bg-gray-700 p-4">
                      {/* Menu Header */}
                      <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-2">
                        <div className="grid grid-cols-4 dark:text-white font-semibold">
                          <div>Produk</div>
                          <div>Jumlah</div>
                          <div>Harga</div>
                          <div>Subtotal</div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="space-y-2">
                        {order.menu.split('\n').map((item, index) => {
                          const menuName = item.split(' (')[0];
                          const quantity = item.match(/\((\d+)x/)?.[1] || '1';
                          const price = item.match(/Rp([\d,.]+)/)?.[1] || '0';
                          const subtotal = parseInt(price.replace(/\./g, '')) * parseInt(quantity);
                          
                            return (
                            <div key={index} className="grid grid-cols-4 py-2 border-b border-gray-600">
                              <div className="text-gray-900 dark:text-white">{menuName}</div>
                              <div className="text-gray-900 dark:text-white">{quantity}</div>
                              <div className="text-gray-900 dark:text-white">Rp {price}</div>
                              <div className="text-blue-500 dark:text-blue-400">Rp {formatRupiah(subtotal)}</div>
                            </div>
                            );
                        })}
                      </div>

                      {/* Card Footer with Total */}
                      <div className="bg-gray-100 dark:bg-gray-800 mt-4 p-3 rounded-lg flex justify-between items-center">
                        <div className="dark:text-white font-semibold">Total</div>
                        <div className="text-blue-400 text-xl font-bold">
                          Rp {formatRupiah(order.subtotal)}
                        </div>
                      </div>
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