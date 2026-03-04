import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://185.180.205.31:8080', // Adres backendu
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
        cookiePathRewrite: '/',
        rewrite: (path) => path.replace(/^\/api/, ''), // Usuwamy '/api' z początku ścieżki przed wysłaniem
      },
    },
  },
})