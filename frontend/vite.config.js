import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/predict-enzyme': 'http://localhost:5000',
      '/predict-decomposition': 'http://localhost:5000',
      '/user': 'http://localhost:5000',
      '/guide': 'http://localhost:5000',
      '/supported-wastes': 'http://localhost:5000',
      '/health': 'http://localhost:5000'
    }
  }
});
