import {
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_LOGOUT,
    AUTH_REGISTER_SUCCESS,
    AUTH_REGISTER_FAILURE
} from '../actions/types';

const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
    error: null
};

export default function authReducer(state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case AUTH_LOGIN_SUCCESS:
        case AUTH_REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token);
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                error: null
            };
        case AUTH_LOGIN_FAILURE:
        case AUTH_REGISTER_FAILURE:
        case AUTH_LOGOUT:
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                error: payload
            };
        default:
            return state;
    }
}
