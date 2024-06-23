// server.mjs

import express from 'express';
import { json, urlencoded, static as serveStatic } from 'express';
import mongoose from 'mongoose';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { config } from 'dotenv';
import Product from './models/Product.mjs';
import { seedProducts } from './seedProducts.js';
import { router as productRouter } from './routes/productRoutes.mjs';
import invoiceRouter from './routes/invoiceRoutes.mjs';
import quoteRouter from './routes/quoteRoutes.mjs';
import userRouter from './routes/userRoutes.mjs';
import adminRouter from './routes/adminRoutes.mjs';
import cartRouter from './routes/cartRoutes.mjs';
import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.set('views', join(dirname(fileURLToPath(import.meta.url)), 'views'));

// Middleware
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(serveStatic(join(dirname(fileURLToPath(import.meta.url)), 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/product-app'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/product-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
    // Seed the database
    seedProducts(); // Call the seed function
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
    res.sendFile(join(dirname(fileURLToPath(import.meta.url)), 'client/products.html'));
});

// Cart and checkout routes
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Cart', cart: req.session.cart || [] });
});

app.get('/api/cart/checkout', (req, res) => {
    res.render('checkout', { title: 'Checkout', cart: req.session.cart || [] });
});

// Render other pages
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
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
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
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (req.body.name) {
            product.name = req.body.name;
        }
        if (req.body.price) {
            product.price = req.body.price;
        }
        if (req.body.description) {
            product.description = req.body.description;
        }
        if (req.body.inStock !== undefined) {
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
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.remove();
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Generate invoice endpoint
app.post('/api/generate-invoice', async (req, res) => {
    const products = req.body.products;
    const customerInfo = req.body.customerInfo;

    // Create a new PDF document
    const doc = new PDFDocument();
    const filename = `invoice_${Date.now()}.pdf`;
    const filePath = `./invoices/${filename}`;

    doc.pipe(createWriteStream(filePath));

    // Add document title
    doc.fontSize(25).text('Invoice', { align: 'center' });

    // Add customer info
    doc.fontSize(12).text(`Customer: ${customerInfo.name}`);
    doc.text(`Email: ${customerInfo.email}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    // Add product details
    doc.fontSize(15).text('Products:');
    products.forEach(product => {
        doc.fontSize(12).text(`- ${product.name}: R ${product.price} x ${product.quantity} = R ${product.price * product.quantity}`);
    });

    // Calculate total
    const total = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    doc.moveDown();
    doc.fontSize(15).text(`Total: R ${total}`);

    // Finalize the PDF and end the stream
    doc.end();

    doc.on('finish', () => {
        res.json({ success: true, filePath: `/invoices/${filename}` });
    });
});

// Serve the invoice files
app.use('/invoices', serveStatic('invoices'));

// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
