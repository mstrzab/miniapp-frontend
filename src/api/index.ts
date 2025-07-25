import axios from 'axios';

// ВАЖНО: Замените на реальный публичный IP-адрес или домен вашего сервера
// Используйте порт 8000, который мы настроили для Uvicorn
const API_BASE_URL = 'http://91.108.240.117:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Перехватчик (interceptor) для добавления JWT в каждый запрос
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
