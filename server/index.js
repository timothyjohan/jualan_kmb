const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Konfigurasi database
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'kasir_db'
});

// API endpoint untuk menyimpan pesanan
app.post('/api/orders', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { customer_name, items, total_amount, order_date } = req.body;

    // Insert ke tabel orders
    const [orderResult] = await connection.execute(
      'INSERT INTO orders (customer_name, total_amount, order_date) VALUES (?, ?, ?)',
      [customer_name, total_amount, order_date]
    );

    const orderId = orderResult.insertId;

    // Insert ke tabel order_items
    for (const item of items) {
      await connection.execute(
        'INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.product_id, item.product_name, item.quantity, item.price, item.subtotal]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Order saved successfully', orderId });

  } catch (error) {
    await connection.rollback();
    console.error('Error saving order:', error);
    res.status(500).json({ error: 'Failed to save order' });
  } finally {
    connection.release();
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 