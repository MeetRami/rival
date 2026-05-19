import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // IMPORTANT for GitHub Pages
  base: '/rival/',

  server: {
    // Allow access from other devices on local network for phone testing
    host: true,
    port: 5173,
  },

  build: {
    target: 'es2020',

    // Strip console.log in production
    minify: 'esbuild',
  },
});