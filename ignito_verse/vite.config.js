import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_TARGET_URL = 'https://1ejrtfddba.execute-api.ap-south-1.amazonaws.com/default';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: API_TARGET_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

