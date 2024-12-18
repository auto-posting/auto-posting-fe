import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { logout } from '../api/authApi';

export default function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [cookies] = useCookies();

  function handleLogin() {
    if (!!cookies.access_token) setIsAuth(true);
  }

  async function handleLogout() {
    try {
      setIsAuth(false);
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
