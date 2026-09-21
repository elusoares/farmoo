import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/animais': {
        target: 'http://localhost:9001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/animais/, ''),
      },
      '/api/producoes': {
        target: 'http://localhost:9002',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/producoes/, ''),
      },
      '/api/financeiro': {
        target: 'http://localhost:9003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/financeiro/, ''),
      },
      '/api/chat': {
        target: 'http://localhost:9103',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''),
      },
    },
  },
})
