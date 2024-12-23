import { getGoogleAuth } from '@/features/auth/api/authApi';
import useFetch from '@/shared/model/useFetch';
import { useCallback, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const code = typeof window !== 'undefined' && new URL(window.location.toString()).searchParams.get('code');

export default function GoogleCallback() {
  const [, setCookie] = useCookies();
  const navigate = useNavigate();
  const { data, execute } = useFetch(() => getGoogleAuth({ code }));

  const fetchData = useCallback(() => {
    if (!data) {
      execute();
    }
  }, [data, execute]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      if (data.success) {
        setCookie('access_token', data.tokens.access, { path: '/', secure: true, sameSite: 'lax' });
        setCookie('refresh_token', data.tokens.refresh, { path: '/', secure: true, sameSite: 'lax' });
        navigate('/my');
      } else {
        navigate('/login');
      }
    }
  }, [data, navigate, setCookie]);

  return <></>;
}
