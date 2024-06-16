import axios from 'axios';
import { GET_INVOICES, CREATE_INVOICE, DELETE_INVOICE, UPDATE_INVOICE, INVOICE_ERROR } from './types';

// Get all invoices
export const getInvoices = () => async dispatch => {
    try {
        const res = await axios.get('/api/invoices');
        dispatch({ type: GET_INVOICES, payload: res.data });
    } catch (err) {
        dispatch({ type: INVOICE_ERROR, payload: err.response.data.message });
    }
};

// Create a new invoice
export const createInvoice = invoiceData => async dispatch => {
    try {
        const res = await axios.post('/api/invoices', invoiceData);
        dispatch({ type: CREATE_INVOICE, payload: res.data });
    } catch (err) {
        dispatch({ type: INVOICE_ERROR, payload: err.response.data.message });
    }
};

// Update an invoice
export const updateInvoice = (id, invoiceData) => async dispatch => {
    try {
        const res = await axios.put(`/api/invoices/${id}`, invoiceData);
        dispatch({ type: UPDATE_INVOICE, payload: res.data });
    } catch (err) {
        dispatch({ type: INVOICE_ERROR, payload: err.response.data.message });
    }
};

// Delete an invoice
export const deleteInvoice = id => async dispatch => {
    try {
        await axios.delete(`/api/invoices/${id}`);
        dispatch({ type: DELETE_INVOICE, payload: id });
    } catch (err) {
        dispatch({ type: INVOICE_ERROR, payload: err.response.data.message });
    }
};
