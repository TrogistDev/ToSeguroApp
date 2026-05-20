import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

apiClient.interceptors.request.use((config) => {
  const { token, tenantSlug } = useAuthStore.getState();
  
  // Debug rígido: se isso não aparecer no seu console ao clicar em upload,
  // a requisição está saindo sem autenticação.
  console.log("🚀 Request Interceptor Debug:", { 
      url: config.url, 
      hasToken: !!token, 
      hasTenant: !!tenantSlug 
  });

  if (tenantSlug) {
    config.headers['x-tenant-id'] = tenantSlug;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default apiClient;