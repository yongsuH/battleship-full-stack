import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', 
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // 后端地址
        changeOrigin: true,              // 允许跨域
        secure: false,                   // 允许自签名证书
      },
    },
  },
})
