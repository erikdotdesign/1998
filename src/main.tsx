import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import "./reset.css";
import "98.css";
import "./98e.css";
import './index.css';
import WindowProvider from './WindowProvider.tsx';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WindowProvider>
      <App />
    </WindowProvider>
  </StrictMode>,
);
