import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export default function useAuth() {
  const [isAuth, setIsAuth] = useState(false);
  const [cookies, setCookies, removeCookies] = useCookies(['accessToken', 'refreshToken']);

  useEffect(() => {
    if (cookies.accessToken && cookies.accessToken !== 'undefined') {
      setIsAuth(true);
    } else {
      setIsAuth(false);
    }
  }, [cookies.accessToken]);

  function handleLogin(token: string, refreshToken: string) {
    setCookies('accessToken', token, { path: '/' });
    if (refreshToken) {
      setCookies('refreshToken', refreshToken, { path: '/' });
    }
    setIsAuth(true);
  }

  function handleLogout() {
    removeCookies('accessToken', { path: '/' });
    removeCookies('refreshToken', { path: '/' });
    setIsAuth(false);
  }

  return {
    isAuth,
    handleLogin,
    handleLogout,
  };
}
