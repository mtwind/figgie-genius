import react from '@vitejs/plugin-react';
import path, { resolve } from 'path'; // <-- Add this import
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add this 'resolve' section
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      // Define multiple entry points for the build process
      input: {
        'service-worker': resolve(__dirname, 'src/background.ts'),
        'sidepanel-main': resolve(__dirname, 'sidepanel-main.html'),
        'sidepanel-welcome': resolve(__dirname, 'sidepanel-welcome.html')
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
})