import axios from 'axios';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILURE,
  LOGOUT
} from './ActionTypes';

import { API_BASE_URL } from '@/Api/api';

// Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set Authorization header utility
const setAuthHeader = (token) => {
  if (token && token !== 'null' && token.trim() !== '') {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("✅ Token set in header:", token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    console.warn("⚠️ No valid token to set in header.");
  }
};

// ----------------- Register -----------------
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const register = (userData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await api.post('/auth/signup', userData);
    const user = response.data;

    if (user?.jwt) {
      console.log("Received JWT on register:", user.jwt);
      localStorage.setItem('jwt', user.jwt);
      setAuthHeader(user.jwt);
    }

    dispatch(registerSuccess(user));
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error.message || 'Registration failed';
    console.error("Register error:", errorMsg);
    dispatch(registerFailure(errorMsg));
  }
};

// ----------------- Login -----------------
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

export const login = (userData) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await api.post('/auth/signin', userData);
    const user = response.data;

    if (user?.jwt) {
      console.log("Received JWT on login:", user.jwt);
      localStorage.setItem('jwt', user.jwt);
      setAuthHeader(user.jwt);
    }

    dispatch(loginSuccess(user));
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error.message || 'Login failed';
    console.error("Login error:", errorMsg);
    dispatch(loginFailure(errorMsg));
  }
};

// ----------------- Get User -----------------
export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  const token = localStorage.getItem('jwt');
  console.log("🔍 Token for getUser:", token);

  if (!token || token === 'null' || token.trim() === '') {
    dispatch({ type: GET_USER_FAILURE, payload: 'No token found' });
    return;
  }

  try {
    setAuthHeader(token); // just to be safe
    const response = await api.get('/api/users/profile');
    const user = response.data;
    console.log("User fetched:", user);
    dispatch({ type: GET_USER_SUCCESS, payload: user });
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error.message || 'Failed to fetch user';
    console.error("Fetch user error:", errorMsg);
    dispatch({ type: GET_USER_FAILURE, payload: errorMsg });
  }
};

// ----------------- Logout -----------------
export const logout = () => (dispatch) => {
  localStorage.clear();
  delete api.defaults.headers.common['Authorization'];
  dispatch({ type: LOGOUT });
};
