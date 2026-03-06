import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redireciona requisições de /api para a API da Omie
      '/api': {
        target: 'https://app.omie.com.br',
        changeOrigin: true,
        // A regra 'rewrite' foi removida. O caminho /api é necessário
        // tanto para acionar o proxy quanto na URL de destino da Omie.
      }
    }
  }
})
