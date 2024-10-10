// src/services/api.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
});

// Add a request interceptor to include the token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized, possibly token expired
      toast.error('Session expired. Please log in again.');
      // Optionally, trigger logout here
    }
    return Promise.reject(error);
  }
);

export default api;
