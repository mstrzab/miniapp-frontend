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
      if (token) {
        try {
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (error) {
          logout();
        } finally {
          setLoading(false);
        }
        return;
      }

      if (initData) {
        try {
          const response = await api.post('/auth/telegram', {
            init_data: initData,
          });
          const new_token = response.data.access_token;
          setToken(new_token);
          const userResponse = await api.get('/users/me');
          setUser(userResponse.data);
        } catch (error) {
          console.error('Authentication failed', error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    authenticate();
  }, []);

  return useAuthStore((state) => ({
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    user: state.user,
  }));
};
