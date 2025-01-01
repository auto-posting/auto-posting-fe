import { RouterProvider } from 'react-router-dom';
import './App.css';
import router from './app/routes';
import { CookiesProvider } from 'react-cookie';
import { ModalProvider } from './shared/model/ModalContext';

function App() {
  return (
    <CookiesProvider>
      <ModalProvider>
        <RouterProvider router={router} />
      </ModalProvider>
    </CookiesProvider>
  );
}

export default App;
