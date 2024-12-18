import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { logout } from '../api/authApi';

export default function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [cookies, removeCookie] = useCookies();

  function handleLogin() {
    if (cookies.access_token) setIsAuth(true);
  }

  async function handleLogout() {
    try {
      removeCookie('access_token', { path: '/' });
      removeCookie('refresh_token', { path: '/' });
      setIsAuth(false);
      console.log('Attempting logout API call');
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  return {
    isAuth,
    cookies,
    handleLogin,
    handleLogout,
  };
}
