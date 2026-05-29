import axios from 'axios';

const host = window.location.hostname;
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || `http://${host}:8000/api/`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const host = window.location.hostname;
  const apiBase = import.meta.env.VITE_API_URL || `http://${host}:8000/api/`;
  const base = apiBase.replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export default api;
