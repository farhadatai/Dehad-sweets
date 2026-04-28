
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['react-dev-locator'],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root',
    }),
    tsconfigPaths(),
    VitePWA({ registerType: 'autoUpdate' }),
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
