// apps/web/src/App.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AccidentReportForm } from './components/forms/AccidentReportForm';
import { LoginForm } from './components/forms/LoginForm';
import { Layout } from './components/layout/Layout';
import { useAuthStore } from './store/authStore';
import { AdminDashboard } from './components/AdminDashboard/AdminDashboard';

const AppContent: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Layout>
      {!isAuthenticated ? (
        /* FLUXO 1: NÃO AUTENTICADO - COMPORTAMENTO ADAPTÁVEL TOTAL */
        <div className="w-full max-w-md mx-auto px-2 sm:px-0 flex flex-col items-center justify-center my-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2 w-full">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-words">
              AccidentPro
            </h2>
          </div>

          {/* p-5 no mobile e p-8 no desktop para evitar amassar os elementos */}
          <div className="bg-white pb-5 pt-5 sm:p-8 rounded-2xl shadow-xl border border-slate-100 w-full box-border">
            <LoginForm /> 
          </div>
        </div>
      ) : user?.role === 'ADMIN' ? (
        /* FLUXO 2: AUTENTICADO COMO ADMINISTRADOR - DASHBOARD */
        <div className="w-full max-w-6xl mx-auto px-2  animate-in fade-in duration-300">
          <AdminDashboard />
        </div>
      ) : (
        /* FLUXO 3: AUTENTICADO COMO USUÁRIO OPERACIONAL (KONVA) */
        <div className="w-full max-w-4xl mx-auto  flex flex-col justify-center animate-in fade-in zoom-in-95 duration-400">
          <div className="mb-6 w-full text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 break-words">
              {t('welcome')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed break-words">
              {t('start_report')}
            </p>
          </div>
          <div className="w-full overflow-x-auto rounded-xl">
            <AccidentReportForm />
          </div>
        </div>
      )}
    </Layout>
  );
};

const App: React.FC = () => {
  const { i18n } = useTranslation();

  return (
    <GoogleOAuthProvider 
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
      key={i18n.language}
      locale={i18n.language.startsWith('es') ? 'es' : 'en'}
    >
      <AppContent />
    </GoogleOAuthProvider>
  );
};

export default App;