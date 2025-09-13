/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,       // ✅ allows describe, it, expect without imports
    environment: 'jsdom', // ✅ browser-like environment
    setupFiles: './src/setupTests.ts', // optional for jest-dom
  },
});
