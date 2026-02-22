// services/api.js
import axios from 'axios';

//const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  //baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

// User APIs
export const getUserProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

export const getSavedDrugs = async () => {
  const response = await api.get('/users/saved-drugs');
  return response.data;
};

// Drug APIs
export const searchDrugs = async (query) => {
  const response = await api.get(`/drugs/search?q=${query}`);
  return response.data;
};

export const getDrugDetails = async (drugId) => {
  const response = await api.get(`/drugs/${drugId}`);
  return response.data;
};

export default api;