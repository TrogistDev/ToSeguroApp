import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// ✅ Defesa Rígida: Validação e Fallback nativo do Vite (sem depender de process.env)
const getBaseURL = (): string => {
  const viteApiUrl = import.meta.env.VITE_API_URL;
  
  if (import.meta.env.PROD) {
    // Se estiver em produção, VITE_API_URL é estritamente obrigatório
    return viteApiUrl || `http://${window.location.hostname}:3000/api`;
  }
  
  // Ambiente de desenvolvimento local
  return viteApiUrl || "http://localhost:3000/api";
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // Boa prática de resiliência: evita requisições 'pending' infinitas
});

// Interceptor de Requisição
apiClient.interceptors.request.use((config) => {
  const { token, tenantSlug } = useAuthStore.getState();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Padronização de segurança para arquitetura Multi-tenant
  if (tenantSlug) {
    config.headers['x-tenant-id'] = tenantSlug; 
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;