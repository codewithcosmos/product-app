import axios from 'axios';
import { GET_QUOTES, CREATE_QUOTE, DELETE_QUOTE, UPDATE_QUOTE, QUOTE_ERROR } from './types';

// Get all quotes
export const getQuotes = () => async dispatch => {
    try {
        const res = await axios.get('/api/quotes');
        dispatch({ type: GET_QUOTES, payload: res.data });
    } catch (err) {
        dispatch({ type: QUOTE_ERROR, payload: err.response.data.message });
    }
};

// Create a new quote
export const createQuote = quoteData => async dispatch => {
    try {
        const res = await axios.post('/api/quotes', quoteData);
        dispatch({ type: CREATE_QUOTE, payload: res.data });
    } catch (err) {
        dispatch({ type: QUOTE_ERROR, payload: err.response.data.message });
    }
};

// Update a quote
export const updateQuote = (id, quoteData) => async dispatch => {
    try {
        const res = await axios.put(`/api/quotes/${id}`, quoteData);
        dispatch({ type: UPDATE_QUOTE, payload: res.data });
    } catch (err) {
        dispatch({ type: QUOTE_ERROR, payload: err.response.data.message });
    }
};

// Delete a quote
export const deleteQuote = id => async dispatch => {
    try {
        await axios.delete(`/api/quotes/${id}`);
        dispatch({ type: DELETE_QUOTE, payload: id });
    } catch (err) {
        dispatch({ type: QUOTE_ERROR, payload: err.response.data.message });
    }
};
