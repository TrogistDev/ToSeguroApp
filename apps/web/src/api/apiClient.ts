import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  // Garante que o fallback para localhost funciona se VITE_API_URL falhar
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

apiClient.interceptors.request.use((config) => {
  const { token, tenantSlug } = useAuthStore.getState();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Padronize aqui: O servidor espera 'x-tenant-id'
  if (tenantSlug) {
    config.headers['x-tenant-id'] = tenantSlug; 
  }

  return config;
});

export default apiClient;