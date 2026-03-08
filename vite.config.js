import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://app.omie.com.br',
        changeOrigin: true,
        // Remova qualquer linha de 'rewrite' que existir aqui
      }
    }
  }
})