import { GET_QUOTES, CREATE_QUOTE, UPDATE_QUOTE, DELETE_QUOTE, QUOTE_ERROR } from '../actions/types';

const initialState = {
    quotes: [],
    error: null
};

export default function quoteReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_QUOTES:
            return {
                ...state,
                quotes: payload,
                error: null
            };
        case CREATE_QUOTE:
            return {
                ...state,
                quotes: [...state.quotes, payload],
                error: null
            };
        case UPDATE_QUOTE:
            return {
                ...state,
                quotes: state.quotes.map(quote =>
                    quote._id === payload._id ? payload : quote
                ),
                error: null
            };
        case DELETE_QUOTE:
            return {
                ...state,
                quotes: state.quotes.filter(quote => quote._id !== payload),
                error: null
            };
        case QUOTE_ERROR:
            return {
                ...state,
                error: payload
            };
        default:
            return state;
    }
}
