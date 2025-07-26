import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Spinner from './components/Spinner';

function App() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  return isAuthenticated ? <HomePage /> : <LoginPage />;
}

export default App;
