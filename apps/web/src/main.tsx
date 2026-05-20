// apps/web/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './app';
import './index.css';
import i18n from './i18n/config'; // Garante o caminho correto do teu ficheiro de config

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento root no DOM.");
}

// Resgata a variável com tipagem segura garantida pelo vite-env.d.ts
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  console.error("⚠️ Crítico: VITE_GOOGLE_CLIENT_ID não está configurado no arquivo .env");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}key={i18n.language}
      locale={i18n.language.startsWith('es') ? 'es' : 'en'}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);