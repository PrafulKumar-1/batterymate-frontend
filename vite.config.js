import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Line 4-15: Vite configuration
export default defineConfig({
  plugins: [react()],     // Line 5: React plugin
  server: {
    port: 3000,           // Line 7: Dev server port
    proxy: {
      // Line 9-14: Proxy API calls to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
