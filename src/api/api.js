// src/api/api.js
import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const api = axios.create({
  baseURL: baseUrl, 
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Interceptor لو محتاجة تضيفي توكن أو تعملي لوجين
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
