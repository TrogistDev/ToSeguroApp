import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Injeta dinamicamente a URL da VPS em produção ou mantém localhost em desenvolvimento
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://ec2-13-60-56-153.eu-north-1.compute.amazonaws.com:3000/api' || 'http://localhost:3000/api', 
});

apiClient.interceptors.request.use((config) => {
  const { token, tenantSlug } = useAuthStore.getState();
  
  // Debug rígido: se isso não aparecer no seu console ao clicar em upload,
  // a requisição está saindo sem autenticação.
  console.log("🚀 Request Interceptor Debug:", { 
      url: config.url, 
      baseURL: config.baseURL, // Adicionado para validação de rota em produção
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