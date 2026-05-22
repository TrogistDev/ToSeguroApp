import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  // O Vite injeta automaticamente variáveis VITE_ quando estão no processo de build
  // Não precisas de "define" manual se o Docker passar os ARGs corretamente.
})