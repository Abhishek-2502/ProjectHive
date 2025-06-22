import axios from 'axios';
const LOCALHOST = 'http://54.243.1.136:5054';

export const API_BASE_URL = LOCALHOST;

const api = axios.create({
  baseURL: API_BASE_URL,
});

const token = localStorage.getItem('jwt');

console.log('JWT token in frontend:', token);  

if (token && token !== 'null') {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} else {
  // Remove header if token is missing or invalid
  delete api.defaults.headers.common['Authorization'];
}

api.defaults.headers.post['Content-Type'] = 'application/json';

export default api;
