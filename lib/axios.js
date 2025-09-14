import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // This is important for sending cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
