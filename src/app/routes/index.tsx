import { createBrowserRouter } from 'react-router-dom';
import Login from '@/pages/login';
import My from '@/pages/my';
import Layout from '../ui/Layout';

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
        path: 'my',
        element: <My />,
      },
    ],
  },
]);

export default router;
