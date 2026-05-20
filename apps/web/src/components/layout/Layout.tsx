// apps/web/src/components/layout/Layout.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../LanguageSelector';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../store/authStore';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { t } = useTranslation();
  const { isAuthenticated, logout, tenantSlug, user } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header Responsivo: Removido h-16 fixa para suportar quebra de linha em telas pequenas */}
      <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50 w-full px-4 py-3 md:py-0 md:h-16 flex items-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center w-full md:gap-4">
          
          {/* BLOCO ESQUERDO: Marca e Identificação do Tenant (Ocupa a largura total no mobile) */}
          <div className="flex items-center justify-between md:justify-start gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 select-none">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white font-bold text-sm sm:text-base">AS</div>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-800 uppercase">
                Accident<span className="text-blue-600">Pro</span>
              </span>
            </div>
            
            {isAuthenticated && tenantSlug && (
              <span className="text-[10px] sm:text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 uppercase animate-in fade-in">
                {tenantSlug}
              </span>
            )}
          </div>

          {/* BLOCO DIREITO: Navegação e Ações do Usuário (Quebra para baixo com w-full no mobile) */}
          <nav className="flex items-center justify-end gap-2 sm:gap-4 w-full pt-1 md:w-auto md:pt-0 border-t border-slate-100 md:border-none">
            <div className="flex-1 md:flex-initial flex justify-end">
              <LanguageSelector />
            </div>
            
            {isAuthenticated && (
              <>
                <div className="hidden md:block h-6 w-[1px] bg-slate-200 mx-1 sm:mx-2" />
                
                {/* Dados do usuário autenticado */}
                <div className="text-right hidden md:block">
                  <p className="text-xs font-bold text-slate-700">{user?.name}</p>
                  <p className="text-[10px] text-slate-400">{user?.email}</p>
                </div>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={logout} 
                  className=" text-xs font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-150 h-9 flex items-center justify-center min-w-[70px]"
                  type="button"
                >
                  {t('btn_logout', 'Sair')}
                </Button>
              </>
            )}
          </nav>


        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-1.5 py-6 sm:py-12 flex flex-col justify-center items-center">
        <div className="w-full flex-1 flex flex-col justify-center items-center">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 sm:py-6 border-t border-slate-200 text-center text-slate-500 text-xs sm:text-sm bg-white">
        &copy; {new Date().getFullYear()} AccidentPro SaaS - Multi-tenant Secure System
      </footer>
    </div>
  );
};