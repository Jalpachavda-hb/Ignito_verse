import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const API_TARGET_URL = 'https://1ejrtfddba.execute-api.ap-south-1.amazonaws.com/default';
const ASSET_TARGET_URL = 'https://verse.ignitolearn.com';
//  const API_TARGET_URL = 'https://verse.ignitolearn.com';
//  const ASSET_TARGET_URL = 'https://verse.ignitolearn.com';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Direct file uploads to asset storage server if required
      '^/api/.*CommonUploadFile': {
        target: ASSET_TARGET_URL,
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: API_TARGET_URL,
        changeOrigin: true,
        secure: false,
      },
      '/HomePageImages': {
        target: ASSET_TARGET_URL,
        changeOrigin: true,
        secure: false,
      },
      '/TestimonialImage': {
        target: ASSET_TARGET_URL,
        changeOrigin: true,
        secure: false,
      },
      '/HomeTrustedLogoImage': {
        target: ASSET_TARGET_URL,
        changeOrigin: true,
        secure: false,
      },
      '/StudentImage': {
        target: ASSET_TARGET_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

