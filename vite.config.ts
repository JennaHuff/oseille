import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  includeAssets: ['favicon.ico'],
  manifest: {
    name: 'Oseille',
    short_name: 'Oseille',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { type: 'image/png', sizes: '32x32', src: '/favicon-32x32.png' },
      { type: 'image/png', sizes: '180x180', src: '/apple-touch-icon.png' },
      { type: 'image/png', sizes: '16x16', src: '/favicon-16x16.png' },
    ],
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    orientation: 'portrait',
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(pwaOptions)],
  define: {
    global: 'window',
  },
});
