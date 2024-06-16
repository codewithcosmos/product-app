import { GET_INVOICES, CREATE_INVOICE, UPDATE_INVOICE, DELETE_INVOICE, INVOICE_ERROR } from '../actions/types';

const initialState = {
    invoices: [],
    error: null
};

export default function invoiceReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_INVOICES:
            return {
                ...state,
                invoices: payload,
                error: null
            };
        case CREATE_INVOICE:
            return {
                ...state,
                invoices: [...state.invoices, payload],
                error: null
            };
        case UPDATE_INVOICE:
            return {
                ...state,
                invoices: state.invoices.map(invoice =>
                    invoice._id === payload._id ? payload : invoice
                ),
                error: null
            };
        case DELETE_INVOICE:
            return {
                ...state,
                invoices: state.invoices.filter(invoice => invoice._id !== payload),
                error: null
            };
        case INVOICE_ERROR:
            return {
                ...state,
                error: payload
            };
        default:
            return state;
    }
}
