const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session); // Corrected syntax here
const dotenv = require('dotenv');
const Product = require('./models/Product');
const seedProducts = require('./seed');
const checkoutRouter = require('./routes/checkout'); 
const productRouter = require('./routes/products'); 
const productRouter = require('./routes/productRoutes'); // Assuming you have separate route files
const invoiceRouter = require('./routes/invoiceRoutes'); 
const quoteRouter = require('./routes/quoteRoutes'); 
const userRouter = require('./routes/userRoutes'); 
const adminRouter = require('./routes/adminRoutes'); 
const cartRouter = require('./routes/cartRoutes'); 
const PDFDocument = require('pdfkit');
const fs = require('fs');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ 
        mongooseConnection: mongoose.connection,
        mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/webdev-services'
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// Connect to MongoDB
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

// Include the checkoutRouter
app.use('/api/checkout', checkoutRouter); 

// Home route
app.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('index', { title: 'Home', products });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve static files for client-side rendering
app.get('/client/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/products.html'));
});

// Cart and checkout routes
app.get('/cart', (req, res) => {
    res.render('cart', { title: 'Cart', cart: req.session.cart || [] });
});

app.get('/api/cart/checkout', (req, res) => {
    res.render('checkout', { title: 'Checkout', cart: req.session.cart || [] });
});

// Render other pages
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
        if (req.body.inStock) {
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

    doc.pipe(fs.createWriteStream(filePath));

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
app.use('/invoices', express.static('invoices'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
