import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch all products
export const fetchProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch a product by ID
export const fetchProductById = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new product
export const createProduct = async (product) => {
    try {
        const response = await api.post('/products', product);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch all items in the cart
export const fetchCartItems = async () => {
    try {
        const response = await api.get('/cart');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add an item to the cart
export const addToCart = async (item) => {
    try {
        const response = await api.post('/cart', item);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Checkout the cart
export const checkoutCart = async (orderDetails) => {
    try {
        const response = await api.post('/cart/checkout', orderDetails);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch all quotes
export const fetchQuotes = async () => {
    try {
        const response = await api.get('/quotes');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new quote
export const createQuote = async (quoteData) => {
    try {
        const response = await api.post('/quotes', quoteData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch all invoices
export const fetchInvoices = async () => {
    try {
        const response = await api.get('/invoices');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Create a new invoice
export const createInvoice = async (invoiceData) => {
    try {
        const response = await api.post('/invoices', invoiceData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// User login
export const login = async (userData) => {
    try {
        const response = await api.post('/login', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add other API functions as needed
