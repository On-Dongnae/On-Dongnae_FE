import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.on-dongnae.site',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 Unauthorized 처리 (토큰 만료 등)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default api;
