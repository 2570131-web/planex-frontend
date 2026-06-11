// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider }     from './context/AuthContext.jsx';
import { ThemeProvider }    from './context/ThemeContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <SettingsProvider>
          <AuthProvider>
            <App />
            <Toaster position="top-right" toastOptions={{
              duration: 4000,
              style: { fontFamily:"'DM Sans',sans-serif", fontSize:'14px', fontWeight:'500', borderRadius:'12px', padding:'12px 16px' },
              success: { iconTheme: { primary:'#f0c040', secondary:'#0a1628' } },
            }}/>
          </AuthProvider>
        </SettingsProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
