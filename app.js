import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import dotenv from 'dotenv';
import Product from './models/Product.mjs';
import seedProducts from './seed';
import Cart from './models/Cart.mjs';
import checkoutRouter from './routes/checkout.mjs';
import adminRoutes from './routes/adminRoutes.mjs';
import productsRoutes from './routes/products.mjs';
import { requireAdmin } from './authMiddleware';

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

// Session configuration
const MongoStore = connectMongo(session);
app.use(session({
    secret: process.env.SESSION_SECRET,
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
app.get('/', async (_req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { title: 'Home', products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Products route
app.get('/products', async (_req, res) => {
    try {
        const products = await Product.find();
        res.render('products', { title: 'Products', products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Cart routes

// Display cart
app.get('/cart', async (_req, res) => {
    try {
        const cartItems = await Cart.find().populate('product');
        res.render('cart', { title: 'Cart', cartItems });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add product to cart
app.post('/cart/add/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const newCartItem = new Cart({ product: productId, quantity: 1 });
        await newCartItem.save();
        res.redirect('/cart'); // Redirect to cart page after adding
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove product from cart
app.post('/cart/remove/:cartItemId', async (req, res) => {
    const cartItemId = req.params.cartItemId;
    try {
        await Cart.findByIdAndRemove(cartItemId);
        res.redirect('/cart'); // Redirect to cart page after removing
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin routes (example)
app.get('/admin/login', (_req, res) => {
    res.render('admin/login', { title: 'Admin Login' });
});

app.get('/admin/dashboard', requireAdmin, (_req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard', adminName: 'Admin' });
});

// API endpoint to fetch products (for client-side rendering)
app.get('/api/products', async (_req, res) => {
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
