/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base relativa: el build en dist/ funciona desde cualquier servidor estático, sin internet.
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2500,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
