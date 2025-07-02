import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    testTimeout: 10000,
    environment: 'jsdom',             // ✅ This fixes the "document is not defined" error
    globals: true,                    // ✅ Allows using `test()` without importing it
    setupFiles: './src/test/setup.js', // optional if you have global setup
    exclude: [...configDefaults.exclude, 'node_modules'],
  },
});
