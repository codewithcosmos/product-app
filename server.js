const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const seedProducts = require('./seed');
const Product = require('./models/Product');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

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
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
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

app.get('/admin/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('admin/products', { title: 'Manage Products', products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/admin/orders', (req, res) => {
    res.render('admin/orders', { title: 'Manage Orders' });
});

// REST API Endpoints
app.get('/api/products', async (req, res) => {
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
// server.js or app.js
require('dotenv').config();
const express = require('express');

// other configurations and middleware

app.listen(3000, () => {
    console.log('Server running on port 3000');
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
