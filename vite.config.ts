import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  publicDir: path.resolve(import.meta.dirname, './client/public'),
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './client/src'),
    },
  },
  server: {
    port: 3000,
    watch: {
      ignored: ['**/server/src/data/**', '**/server/data/**', '**/data/**', '**/client/public/images/uploads/**'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5050',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
});
