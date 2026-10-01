const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Sample In-Memory Database
let products = [
  {
    id: 'prod-101',
    title: 'Ethnic Bandhani Silk Saree',
    category: 'Sarees',
    wholesalePrice: 350,
    mrp: 1299,
    suggestedSellingPrice: 599,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=60',
    description: 'Premium Bandhani print silk saree with contrast unstitched blouse piece. Soft fabric, elegant look.',
    supplierName: 'Jaipur Textile Mills',
    rating: 4.5,
    reviewsCount: 128
  },
  {
    id: 'prod-102',
    title: 'Women Printed Anarkali Kurti',
    category: 'Kurtis',
    wholesalePrice: 280,
    mrp: 999,
    suggestedSellingPrice: 499,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60',
    description: 'Pure Rayon printed flowy Anarkali kurti. Suitable for daily wear & festive occasions.',
    supplierName: 'Surat Fashion Hub',
    rating: 4.3,
    reviewsCount: 94
  },
  {
    id: 'prod-103',
    title: "Men's Cotton Slim Fit Casual Shirt",
    category: 'Men Wear',
    wholesalePrice: 220,
    mrp: 799,
    suggestedSellingPrice: 449,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=60',
    description: '100% Cotton breathable casual shirt for men. Available in M, L, XL sizes.',
    supplierName: 'Ludhiana Garments',
    rating: 4.4,
    reviewsCount: 210
  },
  {
    id: 'prod-104',
    title: 'Wireless Bluetooth Earbuds TWS',
    category: 'Electronics',
    wholesalePrice: 399,
    mrp: 1999,
    suggestedSellingPrice: 799,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
    description: 'Noise cancelling TWS earbuds with 24hr battery backup & deep bass sound.',
    supplierName: 'TechVibe Electronics',
    rating: 4.6,
    reviewsCount: 340
  },
  {
    id: 'prod-105',
    title: 'Gold Plated Traditional Jewellery Set',
    category: 'Jewellery',
    wholesalePrice: 180,
    mrp: 899,
    suggestedSellingPrice: 399,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60',
    description: 'Beautiful traditional necklace set with matching earrings. Anti-tarnish coating.',
    supplierName: 'Rajkot Crafts',
    rating: 4.7,
    reviewsCount: 188
  }
];

let orders = [
  {
    orderId: 'MEESH-9841',
    productTitle: 'Ethnic Bandhani Silk Saree',
    wholesalePrice: 350,
    resellerSellingPrice: 599,
    resellerMargin: 249,
    customerName: 'Rahul Verma',
    customerAddress: '42, MG Road, Indore, MP',
    customerPhone: '9876543210',
    paymentMode: 'Cash on Delivery (COD)',
    status: 'Delivered',
    resellerId: 'RES-01',
    createdAt: '2026-09-28'
  }
];

let resellersStats = {
  totalEarned: 249,
  pendingPayout: 249,
  totalOrders: 1,
  totalShared: 12
};

// GET API: Fetch Products
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...products];

  if (category && category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }

  res.json({ success: true, count: filtered.length, products: filtered });
});

// GET API: Single Product
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

// POST API: Add New Product (Supplier Portal)
app.post('/api/products', (req, res) => {
  const { title, category, wholesalePrice, mrp, suggestedSellingPrice, image, description, supplierName } = req.body;

  if (!title || !wholesalePrice) {
    return res.status(400).json({ success: false, message: 'Title and Wholesale Price are required' });
  }

  const newProduct = {
    id: 'prod-' + (products.length + 101),
    title,
    category: category || 'General',
    wholesalePrice: Number(wholesalePrice),
    mrp: Number(mrp) || Number(wholesalePrice) * 2,
    suggestedSellingPrice: Number(suggestedSellingPrice) || Number(wholesalePrice) + 200,
    image: image || 'https://via.placeholder.com/400x400?text=Meesho+Product',
    description: description || 'High quality wholesale product.',
    supplierName: supplierName || 'Verified Supplier',
    rating: 4.5,
    reviewsCount: 1
  };

  products.unshift(newProduct);
  res.json({ success: true, message: 'Product added successfully!', product: newProduct });
});

// POST API: Place Order (Customer / Reseller Order)
app.post('/api/orders', (req, res) => {
  const { productId, resellerSellingPrice, customerName, customerAddress, customerPhone, paymentMode } = req.body;

  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  const finalSellingPrice = Number(resellerSellingPrice) || product.suggestedSellingPrice;
  const margin = finalSellingPrice - product.wholesalePrice;

  const newOrder = {
    orderId: 'MEESH-' + Math.floor(1000 + Math.random() * 9000),
    productId: product.id,
    productTitle: product.title,
    wholesalePrice: product.wholesalePrice,
    resellerSellingPrice: finalSellingPrice,
    resellerMargin: margin > 0 ? margin : 0,
    customerName,
    customerAddress,
    customerPhone,
    paymentMode: paymentMode || 'Cash on Delivery (COD)',
    status: 'Processing',
    resellerId: 'RES-01',
    createdAt: new Date().toISOString().split('T')[0]
  };

  orders.unshift(newOrder);
  resellersStats.totalEarned += newOrder.resellerMargin;
  resellersStats.pendingPayout += newOrder.resellerMargin;
  resellersStats.totalOrders += 1;

  res.json({
    success: true,
    message: 'Order placed successfully! Commission added to Reseller wallet.',
    order: newOrder
  });
});

// GET API: Fetch Orders
app.get('/api/orders', (req, res) => {
  res.json({ success: true, count: orders.length, orders });
});

// GET API: Reseller Stats
app.get('/api/reseller/stats', (req, res) => {
  res.json({ success: true, stats: resellersStats });
});

// Catch-all route to serve main frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Meesho Reselling Server running on port ${PORT}`);
});
