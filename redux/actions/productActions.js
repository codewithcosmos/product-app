import axios from 'axios';
import { GET_PRODUCTS, CREATE_PRODUCT, DELETE_PRODUCT, UPDATE_PRODUCT, PRODUCT_ERROR } from './types';

// Get all products
export const getProducts = () => async dispatch => {
    try {
        const res = await axios.get('/api/products');
        dispatch({ type: GET_PRODUCTS, payload: res.data });
    } catch (err) {
        dispatch({ type: PRODUCT_ERROR, payload: err.response.data.message });
    }
};

// Create a new product
export const createProduct = productData => async dispatch => {
    try {
        const res = await axios.post('/api/products', productData);
        dispatch({ type: CREATE_PRODUCT, payload: res.data });
    } catch (err) {
        dispatch({ type: PRODUCT_ERROR, payload: err.response.data.message });
    }
};

// Update a product
export const updateProduct = (id, productData) => async dispatch => {
    try {
        const res = await axios.put(`/api/products/${id}`, productData);
        dispatch({ type: UPDATE_PRODUCT, payload: res.data });
    } catch (err) {
        dispatch({ type: PRODUCT_ERROR, payload: err.response.data.message });
    }
};

// Delete a product
export const deleteProduct = id => async dispatch => {
    try {
        await axios.delete(`/api/products/${id}`);
        dispatch({ type: DELETE_PRODUCT, payload: id });
    } catch (err) {
        dispatch({ type: PRODUCT_ERROR, payload: err.response.data.message });
    }
};
