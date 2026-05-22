import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// ✅ Defesa Rígida: Validação e Fallback nativo do Vite (sem depender de process.env)
const getBaseURL = (): string => {
  const viteApiUrl = import.meta.env.VITE_API_URL;

  // PRODUÇÃO
  if (import.meta.env.PROD) {
    if (!viteApiUrl) {
      throw new Error("VITE_API_URL não definida");
    }

    return viteApiUrl;
  }

  // DEV
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