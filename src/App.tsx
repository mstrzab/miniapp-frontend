import { useEffect } from 'react';
import { useInitData } from '@telegram-apps/sdk-react';
import { useAuthStore } from './store/authStore';
import api from './api';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Spinner from './components/Spinner';

function App() {
  const initData = useInitData();
  const { token, setToken, setUser, logout, setLoading, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Эта функция запускается один раз при старте
    const authenticate = async () => {
      // Сначала проверяем, есть ли у нас уже токен
      if (token) {
        try {
          const response = await api.get('/users/me');
          setUser(response.data);
        } catch (error) {
          logout(); // Если токен невалидный, выходим
        } finally {
          setLoading(false);
        }
        return;
      }

      // Если токена нет, проверяем, дал ли Telegram initData
      if (initData) {
        try {
          const response = await api.post('/auth/telegram', { init_data: new URLSearchParams(initData).toString() });
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
        // Если нет ни токена, ни initData, прекращаем загрузку
        setLoading(false);
      }
    };

    authenticate();
  }, [initData]); // Запускаем эффект при появлении initData

  if (isLoading) {
    return <Spinner />;
  }

  return isAuthenticated ? <HomePage /> : <LoginPage />;
}

export default App;
