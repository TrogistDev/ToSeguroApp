// apps/web/src/store/authStore.ts
import { create } from 'zustand';

interface UserPayload {
  id: string;
  email: string;
  name: string;
  role: string; // Adicionado rigidamente para controle de fluxo no front
}

interface AuthState {
  token: string | null;
  tenantSlug: string | null;
  user: UserPayload | null;
  isAuthenticated: boolean;
  login: (token: string, tenantSlug: string, user: UserPayload) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('toseguro_token'),
  tenantSlug: localStorage.getItem('toseguro_tenant_slug'),
  user: localStorage.getItem('toseguro_user') 
    ? JSON.parse(localStorage.getItem('toseguro_user')!) 
    : null,
  isAuthenticated: !!localStorage.getItem('toseguro_token'),

  login: (token, tenantSlug, user) => {
    localStorage.setItem('toseguro_token', token);
    localStorage.setItem('toseguro_tenant_slug', tenantSlug);
    localStorage.setItem('toseguro_user', JSON.stringify(user));
    
    set({ 
      token, 
      tenantSlug, 
      user, 
      isAuthenticated: true 
    });
  },

  logout: () => {
    localStorage.removeItem('toseguro_token');
    localStorage.removeItem('toseguro_tenant_slug');
    localStorage.removeItem('toseguro_user');
    
    set({ 
      token: null, 
      tenantSlug: null, 
      user: null, 
      isAuthenticated: false 
    });
  },
}));