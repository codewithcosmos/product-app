import axios from 'axios';

const API_URL = '/api';  // Adjust based on your server's API endpoint

// Example function to fetch products from server
async function fetchProducts() {
    try {
        const response = await axios.get(`${API_URL}/products`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error('Failed to fetch products');
    }
}

export { fetchProducts };
