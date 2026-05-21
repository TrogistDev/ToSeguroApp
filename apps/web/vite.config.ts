import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  // Carrega as variáveis do ficheiro .env para o ambiente atual
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      tailwindcss(),
    ],
    // Garante que estas variáveis ficam acessíveis globalmente no código via import.meta.env
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'import.meta.env.VITE_GOOGLE_CLIENT_ID': JSON.stringify(env.VITE_GOOGLE_CLIENT_ID),
    },
    server: {
      port: 3001,
      proxy: {
        // Dica de arquitetura: Se quiseres evitar problemas de CORS no futuro,
        // podes configurar um proxy aqui para redirecionar /api para o teu backend.
      }
    }
  }
})