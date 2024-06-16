import axios from 'axios';

const baseURL = '/api'; // Replace with your actual backend API base URL

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const fetchProducts = async () => {
    try {
        const response = await api.get('/products');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createInvoice = async (invoiceData) => {
    try {
        const response = await api.post('/invoices', invoiceData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createQuote = async (quoteData) => {
    try {
        const response = await api.post('/quotes', quoteData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const login = async (userData) => {
    try {
        const response = await api.post('/login', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Add other API functions as needed
