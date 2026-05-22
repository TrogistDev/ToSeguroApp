import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  // REMOVA O BLOCO 'define' COMPLETO
  server: {
    port: 3001,
  }
})