// services/api.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
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
  const response = await api.get('/users/me');
  return response.data;
};

export const getSavedDrugs = async () => {
  //const response = await api.get('/users/saved-drugs');
  //return response.data;
  return { data: [] };
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

// ── ML / Predictions API 
const ML_API = axios.create({
  baseURL: 'http://localhost:5001', 
  headers: { 'Content-Type': 'application/json' },
});

// Send drug data → get prediction back
export const predictGenericLaunch = async (drugData) => {
  const response = await ML_API.post('/predict', drugData);
  return response.data;
};

// Get all model insights/stats (for visualizations)
export const getModelInsights = async () => {
  const response = await ML_API.get('/insights');
  return response.data;
};

// Get predictions for multiple drugs at once
export const getBatchPredictions = async (drugs) => {
  const response = await ML_API.post('/predict/batch', { drugs });
  return response.data;
};
export default api;