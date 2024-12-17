import { useState } from 'react';
import { useCookies } from 'react-cookie';

export default function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [cookies, removeCookie] = useCookies();

  function handleLogin() {
    if (cookies.access_token) setIsAuth(true);
  }

  function handleLogout() {
    setIsAuth(false);
    removeCookie('access_token', { path: '/' });
    removeCookie('refresh_token', { path: '/' });
  }

  return {
    isAuth,
    cookies,
    handleLogin,
    handleLogout,
  };
}
