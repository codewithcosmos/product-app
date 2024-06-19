const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');
const Product = require('./models/Product');
const seedProducts = require('./seed');
const checkoutRouter = require('./routes/checkout'); // Assuming checkoutRouter is defined separately
const adminRoutes = require('./routes/adminRoutes'); // Include admin routes
const productsRoutes = require('./routes/products'); // Example client route
const { requireAdmin } = require('./authMiddleware'); // Import admin middleware

// Load environment variables from .env file
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET, // Use environment variable for session secret
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
    // Seed the database on connection
    seedProducts();
}).catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/admin', adminRoutes); // Admin routes
app.use('/products', productsRoutes); // Example client route
app.use('/checkout', checkoutRouter); // Assuming checkoutRouter is defined in a separate file

// Home route
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { title: 'Home', products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Products route
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { title: 'Products', products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cart routes

// Display cart
app.get('/cart', (req, res) => {
    const cart = req.session.cart || [];
    res.render('cart', { title: 'Cart', cart });
});

// Add product to cart
app.post('/cart/add/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        req.session.cart = req.session.cart || [];
        req.session.cart.push(product);
        res.redirect('/cart'); // Redirect to cart page after adding
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove product from cart
app.post('/cart/remove/:productId', (req, res) => {
    const productId = req.params.productId;
    if (req.session.cart) {
        req.session.cart = req.session.cart.filter(item => item._id !== productId);
    }
    res.redirect('/cart'); // Redirect to cart page after removing
});

// Admin routes (example)
app.get('/admin/login', (req, res) => {
    res.render('admin/login', { title: 'Admin Login' });
});

app.get('/admin/dashboard', requireAdmin, (_req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard', adminName: 'Admin' });
});

// API endpoint to fetch products (for client-side rendering)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Client-side rendering of products using Axios (assumed in your original code)
app.get('/client/products', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client/products.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
