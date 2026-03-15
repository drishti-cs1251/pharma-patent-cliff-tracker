import api from './api';

export const registerUser = (name, email, password) =>
  api.post('/auth/register', { name, email, password }).then(r => r.data);
// returns { success, message, token, user: {id, name, email, role} }

export const loginUser = (email, password) =>
  api.post('/auth/login', { email, password }).then(r => r.data);
// returns { success, message, token, user: {id, name, email, role} }

export const getMe = () =>
  api.get('/auth/me').then(r => r.data);
// returns { success, data: {id, name, email, role, created_at} }

export const logoutUser = () => {
  localStorage.removeItem('token');
};