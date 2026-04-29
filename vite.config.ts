
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['react-dev-locator'],
      },
    }),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Dehat Sweets and Foods',
        short_name: 'Dehat',
        icons: [
          {
            src: '/dehat-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/dehat-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: { clientPort: 5173 },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '^/.*\.(jpg|jpeg|png|gif|svg|ico|json|webmanifest)$': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
