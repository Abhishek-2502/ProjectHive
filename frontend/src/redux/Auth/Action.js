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

// Axios instance (optional: to apply token globally if needed)
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Utility to set Authorization header
const setAuthHeader = (token) => {
  if (token && token !== 'null' && token.trim() !== '') {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// ----------------- Register Action -----------------
const registerRequest = () => ({ type: REGISTER_REQUEST });
const registerSuccess = (user) => ({ type: REGISTER_SUCCESS, payload: user });
const registerFailure = (error) => ({ type: REGISTER_FAILURE, payload: error });

export const register = (userData) => async (dispatch) => {
  dispatch(registerRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
    const user = response.data;

    if (user?.jwt) {
      localStorage.setItem('jwt', user.jwt);
      setAuthHeader(user.jwt);
    }

    console.log("Register success:", user);
    dispatch(registerSuccess(user));
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error.message || 'Registration failed';
    console.error("Register error:", errorMsg);
    dispatch(registerFailure(errorMsg));
  }
};

// ----------------- Login Action -----------------
const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

export const login = (userData) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
    const user = response.data;

    if (user?.jwt) {
      localStorage.setItem('jwt', user.jwt);
      setAuthHeader(user.jwt);
    }

    console.log("Login success:", user);
    dispatch(loginSuccess(user));
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error.message || 'Login failed';
    console.error("Login error:", errorMsg);
    dispatch(loginFailure(errorMsg));
  }
};

// ----------------- Get User Profile Action -----------------
export const getUser = () => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });

  const token = localStorage.getItem('jwt');

  if (!token || token === 'null') {
    dispatch({ type: GET_USER_FAILURE, payload: 'No token found' });
    return;
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = response.data;
    console.log("Fetched user profile:", user);
    dispatch({ type: GET_USER_SUCCESS, payload: user });
  } catch (error) {
    const errorMsg = error?.response?.data?.message || error.message || 'Failed to fetch user';
    console.error("User fetch error:", errorMsg);
    dispatch({ type: GET_USER_FAILURE, payload: errorMsg });
  }
};

// ----------------- Logout Action -----------------
export const logout = () => (dispatch) => {
  localStorage.clear();
  delete api.defaults.headers.common['Authorization'];
  dispatch({ type: LOGOUT });
};
