import { useState } from 'react';
import { useCookies } from 'react-cookie';

export default function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [cookies, removeCookie] = useCookies();

  function handleLogin() {
    if (cookies.accessToken) setIsAuth(true);
  }

  function handleLogout() {
    setIsAuth(false);
    removeCookie('accessToken', { path: '/' });
    removeCookie('refreshToken', { path: '/' });
  }

  return {
    isAuth,
    cookies,
    handleLogin,
    handleLogout,
  };
}
