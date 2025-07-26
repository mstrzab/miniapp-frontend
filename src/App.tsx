import { useEffect } from 'react';
import { useWebApp } from '@telegram-apps/sdk-react'; // <-- Правильный хук!
import { useAuthStore } from './store/authStore';
import api from './api';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Spinner from './components/Spinner';

function App() {
  const webApp = useWebApp(); // Получаем объект webApp
  const { token, setToken, setUser, logout, setLoading, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const authenticate = async () => {
      // Получаем сырую строку initData из объекта webApp
      const rawInitData = webApp?.initData;

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

      if (rawInitData) {
        try {
          // Отправляем на бэкенд сырую строку, как он и ожидает
          const response = await api.post('/auth/telegram', { init_data: rawInitData });
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

    // Запускаем аутентификацию, только когда webApp готов
    if (webApp) {
      authenticate();
    }
  }, [webApp]); // Запускаем эффект при появлении webApp

  if (isLoading) {
    return <Spinner />;
  }

  return isAuthenticated ? <HomePage /> : <LoginPage />;
}

export default App;
