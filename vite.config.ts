import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: '::',
    port: 8080,
    proxy: {
      '/gas': {
        target: 'https://script.google.com',
        changeOrigin: true,
        rewrite: (p) =>
          p.replace(
            /^\/gas/,
            '/macros/s/AKfycbyWlsuPGDhLbx2XQ0tTqnmljGe-IQLkxhOM6oFyUsMnEhr_PeaYXko882lLpb0lCiKIrw/exec'
          )
      }
    }
  },
  plugins: mode === 'development' ? [react()] : [],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}))
