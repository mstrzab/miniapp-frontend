import { useEffect } from 'react';
import { useWebApp } from '@telegram-apps/sdk-react';
import { useAuthStore } from '../store/authStore';
import api from '../api';

export const useAuth = () => {
  const { initData } = useWebApp();
  const { 
    token, 
    setToken, 
    setUser, 
    logout, 
    setLoading 
  } = useAuthStore();

  useEffect(() => {
    const authenticate = async () => {
      // Если у нас уже есть токен, пробуем получить данные пользователя
      if (token) {
        try {
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (error) {
          // Если токен невалидный, выходим
          logout();
        } finally {
          setLoading(false);
        }
        return;
      }

      // Если токена нет, но есть initData, отправляем их на бэкенд
      if (initData) {
        try {
          const response = await api.post('/auth/telegram', {
            init_data: initData,
          });
          const new_token = response.data.access_token;
          setToken(new_token);
          // После установки токена, делаем запрос за данными пользователя
          const userResponse = await api.get('/users/me'); // Токен уже подставится интерцептором
          setUser(userResponse.data);
        } catch (error) {
          console.error('Authentication failed', error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        // Если нет ни токена, ни initData (например, открыли в обычном браузере)
        setLoading(false);
      }
    };

    authenticate();
  }, []); // Пустой массив зависимостей, чтобы выполниться один раз при старте

  return useAuthStore((state) => ({
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
};
