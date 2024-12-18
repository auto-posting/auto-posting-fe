import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '@/pages/login';
import My from '@/pages/my';
import Setting from '@/pages/setting';
import Layout from '../ui/Layout';
import { useCookies } from 'react-cookie';

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const [cookies] = useCookies();
  return cookies.access_token && cookies.access_token !== decodeURIComponent('%7B%22path%22%3A%22%2F%22%7D') ? element : <Navigate to="/login" />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
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
