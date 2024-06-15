const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
require('dotenv').config();

const Product = require('./models/Product');
const seedProducts = require('./seed');
const checkoutRouter = require('./routes/checkout'); // Assuming checkoutRouter is defined separately

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session middleware
app.use(session({
    secret: 'your_secret_key', // Replace with your actual secret key
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day in milliseconds
}));

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

// Cart routes
app.get('/cart', (req, res) => {
    // Retrieve cart items from session or database if needed
    const cart = req.session.cart || [];
    res.render('cart', { title: 'Cart', cart });
});

app.post('/cart/add/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Add product to cart in session
        req.session.cart = req.session.cart || [];
        req.session.cart.push(product);
        res.redirect('/cart'); // Redirect to cart page after adding
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/cart/remove/:productId', (req, res) => {
    const productId = req.params.productId;
    // Remove product from cart in session
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item._id !== productId);
    }
    res.redirect('/cart'); // Redirect to cart page after removing
});

// Checkout routes
app.use('/checkout', checkoutRouter); // Assuming checkoutRouter is defined in a separate file

// Admin routes (example)
app.get('/admin/login', (req, res) => {
    res.render('admin/login', { title: 'Admin Login' });
});

app.get('/admin/dashboard', (req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard', adminName: 'Admin' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
