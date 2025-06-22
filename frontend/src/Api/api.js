import axios from 'axios';
const HOST='http://3.93.153.113:5054'

export const API_BASE_URL = HOST

const api = axios.create({
  baseURL: API_BASE_URL,
});

const token = localStorage.getItem('jwt');

console.log("Token from localStorage:", token);

api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

api.defaults.headers.post['Content-Type'] = 'application/json';

export default api;