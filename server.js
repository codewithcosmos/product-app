const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const seedProducts = require('./seed');
const checkoutRouter = require('./routes/checkout'); 
const productRouter = require('./routes/products'); 
const invoiceRouter = require('./routes/invoiceRoutes'); 
const quoteRouter = require('./routes/quoteRoutes'); 
const userRouter = require('./routes/userRoutes'); 
const adminRouter = require('./routes/adminRoutes'); 
const cartRouter = require('./routes/cartRoutes'); 
const axios = require('axios');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/webdev-services' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Database connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/webdev-services', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    // Seed the database
    seedProducts();
}).catch(err => console.log(err));

// Routes
app.use('/api/products', productRouter); 
app.use('/api/invoices', invoiceRouter); 
app.use('/api/quotes', quoteRouter); 
app.use('/api/users', userRouter); 
app.use('/api/admin', adminRouter); 
app.use('/api/cart', cartRouter); 

// Home route
app.get('/', async (_req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { title: 'Home', products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve static files for client-side rendering
app.get('/client/products', (_req, res) => {
    res.sendFile(path.join(__dirname, 'client/products.html'));
});

// Render other pages
app.get('/cart', (_req, res) => {
    res.render('cart', { title: 'Cart' });
});

app.get('/quote', (_req, res) => {
    res.render('quote', { title: 'Request a Quote' });
});

app.get('/invoice', (_req, res) => {
    res.render('invoice', { title: 'Invoice' });
});

// Admin routes
app.get('/admin/login', (_req, res) => {
    res.render('admin/login', { title: 'Admin Login' });
});

app.get('/admin/dashboard', (_req, res) => {
    res.render('admin/dashboard', { title: 'Admin Dashboard', adminName: 'Admin' });
});

app.get('/admin/products', async (_req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/products', { title: 'Manage Products', products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/admin/orders', (_req, res) => {
    res.render('admin/orders', { title: 'Manage Orders' });
});

// REST API Endpoints
app.get('/api/products', async (_req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/products', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        inStock: req.body.inStock
    });

    try {
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.patch('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }

        if (req.body.name != null) {
            product.name = req.body.name;
        }
        if (req.body.price != null) {
            product.price = req.body.price;
        }
        if (req.body.description != null) {
            product.description = req.body.description;
        }
        if (req.body.inStock != null) {
            product.inStock = req.body.inStock;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product == null) {
            return res.status(404).json({ message: 'Cannot find product' });
        }

        await product.remove();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
