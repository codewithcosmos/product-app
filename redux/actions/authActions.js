import axios from 'axios';
import { AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILURE, AUTH_LOGOUT, AUTH_REGISTER_SUCCESS, AUTH_REGISTER_FAILURE } from './types';

// Login action
export const login = (username, password) => async dispatch => {
    try {
        const res = await axios.post('/api/admin/login', { username, password });
        dispatch({ type: AUTH_LOGIN_SUCCESS, payload: res.data });
        localStorage.setItem('token', res.data.token);
    } catch (err) {
        dispatch({ type: AUTH_LOGIN_FAILURE, payload: err.response.data.message });
    }
};

// Logout action
export const logout = () => dispatch => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_LOGOUT });
};

// Register action
export const register = (username, password, email, role) => async dispatch => {
    try {
        const res = await axios.post('/api/users', { username, password, email, role });
        dispatch({ type: AUTH_REGISTER_SUCCESS, payload: res.data });
    } catch (err) {
        dispatch({ type: AUTH_REGISTER_FAILURE, payload: err.response.data.message });
    }
};
