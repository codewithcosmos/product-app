// app.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const Product = require('./models/Product');
const seedProducts = require('./seed');

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  // Seed the database
  seedProducts();
}).catch(err => console.log(err));

// Routes
app.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('index', { title: 'Home', products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.render('products', { title: 'Products', products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/cart', (req, res) => {
  res.render('cart', { title: 'Cart' });
});

app.get('/quote', (req, res) => {
  res.render('quote', { title: 'Request a Quote' });
});

app.get('/invoice', (req, res) => {
  res.render('invoice', { title: 'Invoice' });
});

// Admin routes
app.get('/admin/login', (req, res) => {
  res.render('admin/login', { title: 'Admin Login' });
});

app.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard', { title: 'Admin Dashboard', adminName: 'Admin' });
});

app.get('/admin/products', (req, res) => {
  res.render('admin/products', { title: 'Manage Products' });
});

app.get('/admin/orders', (req, res) => {
  res.render('admin/orders', { title: 'Manage Orders' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
