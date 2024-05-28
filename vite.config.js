import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  base: '/',
  define: {
    'process.env': {
      REACT_APP_URL: JSON.stringify(process.env.REACT_APP_URL),
    },
  },
});
