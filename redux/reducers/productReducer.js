import { GET_PRODUCTS, CREATE_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT, PRODUCT_ERROR } from '../actions/types';

const initialState = {
    products: [],
    error: null
};

export default function productReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_PRODUCTS:
            return {
                ...state,
                products: payload,
                error: null
            };
        case CREATE_PRODUCT:
            return {
                ...state,
                products: [...state.products, payload],
                error: null
            };
        case UPDATE_PRODUCT:
            return {
                ...state,
                products: state.products.map(product =>
                    product._id === payload._id ? payload : product
                ),
                error: null
            };
        case DELETE_PRODUCT:
            return {
                ...state,
                products: state.products.filter(product => product._id !== payload),
                error: null
            };
        case PRODUCT_ERROR:
            return {
                ...state,
                error: payload
            };
        default:
            return state;
    }
}
