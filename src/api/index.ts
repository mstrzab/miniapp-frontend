import axios from 'axios';
const API_BASE_URL = 'http://ВАШ_СЕРВЕР_IP:8000/api/v1'; // <-- НЕ ЗАБУДЬТЕ ЗАМЕНИТЬ!
const api = axios.create({ baseURL: API_BASE_URL });
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) { config.headers.Authorization = `Bearer ${token}`; }
    return config;
  }, (error) => Promise.reject(error)
);
export default api;
