import { useEffect } from 'react';
import { useWebApp } from '@telegram-apps/sdk-react';
import { useAuthStore } from './store/authStore';
import api from './api';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Spinner from './components/Spinner';
function App() {
  const webApp = useWebApp();
  const { token, setToken, setUser, logout, setLoading, isLoading, isAuthenticated } = useAuthStore();
  useEffect(() => {
    const authenticate = async () => {
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
          const response = await api.post('/auth/telegram', { init_data: rawInitData });
          setToken(response.data.access_token);
          const userResponse = await api.get('/users/me');
          setUser(userResponse.data);
        } catch (error) {
          console.error('Auth failed', error);
          logout();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    if (webApp) {
      authenticate();
    }
  }, [webApp]);
  if (isLoading) {
    return <Spinner />;
  }
  return isAuthenticated ? <HomePage /> : <LoginPage />;
}
export default App;
