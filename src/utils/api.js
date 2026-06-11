// src/utils/api.js
import axios from 'axios';
import { auth } from '../config/firebase.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 20000,
});

api.interceptors.request.use(async (cfg) => {
  try {
    const user = auth.currentUser;
    if (user) cfg.headers.Authorization = `Bearer ${await user.getIdToken()}`;
  } catch (_) {}
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => Promise.reject(new Error(err.response?.data?.error || err.message || 'Network error'))
);

export default api;
