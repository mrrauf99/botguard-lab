import axios from 'axios';

export const TOKEN_KEY = 'botguard_token';
export const USER_KEY = 'botguard_user';

export const getApiUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return 'http://localhost:5000';
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.dispatchEvent(new CustomEvent('botguard:auth-expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default api;
