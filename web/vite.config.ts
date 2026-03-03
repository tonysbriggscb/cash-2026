import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tony-briggs/cash-2026/',
  server: {
    port: 8080,
  },
});
