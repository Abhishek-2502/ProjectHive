import axios from 'axios';

// Set your API base URL
const LOCALHOST = 'http://54.243.1.136:5054';
export const API_BASE_URL = LOCALHOST;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Retrieve token from localStorage
const token = localStorage.getItem('jwt');

// Log token to debug
console.log('JWT token in frontend:', token);

// Safely set Authorization header
if (token && token !== 'null' && token !== null && token.trim() !== '') {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  delete api.defaults.headers.common['Authorization'];
}

export default api;
