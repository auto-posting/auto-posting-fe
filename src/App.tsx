import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './app/routes';
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <CookiesProvider>
      <RouterProvider router={router} />;
    </CookiesProvider>
  );
}

export default App;
