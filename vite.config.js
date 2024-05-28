// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

console.log('Environment variable REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  define: {
    'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL)
  }
});
