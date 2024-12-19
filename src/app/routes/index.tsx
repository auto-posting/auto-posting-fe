import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '@/pages/login';
import My from '@/pages/my';
import Setting from '@/pages/setting';
import Layout from '../ui/Layout';
import { useCookies } from 'react-cookie';
import GoogleCallback from '@/pages/callback/google';

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const [cookies] = useCookies(['access_token']);
  return cookies.access_token && cookies.access_token !== 'undefined' ? element : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/auth/google/callback',
    element: <GoogleCallback />,
  },
  {
    path: '/',
    element: <ProtectedRoute element={<Layout />} />,
    children: [
      {
        path: '',
        element: <ProtectedRoute element={<My />} />,
      },
      {
        path: 'my',
        element: <ProtectedRoute element={<My />} />,
      },
      {
        path: 'setting',
        element: <ProtectedRoute element={<Setting />} />,
      },
      {
        path: '*',
        element: <Login />,
      },
    ],
  },
]);

export default router;
