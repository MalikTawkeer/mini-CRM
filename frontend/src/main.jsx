import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import './index.css';
import App from './App.jsx';
import { store } from './store';
import './features/api/authApi';
import './features/api/leadsApi';
import './features/api/dashboardApi';
import './features/api/usersApi';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        theme="dark"
        richColors
        position="top-right"
        closeButton
        toastOptions={{
          classNames: {
            toast: 'bg-slate-800 border border-slate-700 text-slate-100',
          },
        }}
      />
    </Provider>
  </StrictMode>
);
