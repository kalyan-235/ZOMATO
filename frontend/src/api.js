import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Attach Bearer token automatically to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

export const getApiErrorMessage = (error, fallback) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.status === 404) {
    return 'API route not found. Check VITE_API_URL and make sure the backend is up to date.';
  }
  if (!error.response) {
    return `Cannot reach the backend at ${API.defaults.baseURL}. Check that it is running and VITE_API_URL is correct.`;
  }
  return fallback;
};
