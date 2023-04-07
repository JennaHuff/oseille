import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  includeAssets: ['favicon.ico'],
  workbox: {
    maximumFileSizeToCacheInBytes: 3000000,
  },
  manifest: {
    name: 'Oseille',
    short_name: 'Oseille',
    description: 'Oseille cool',
    icons: [{ src: '/favicon.ico', sizes: '16x16 32x32 48x48', type: 'image/x-icon' }],
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
  base: './',
  plugins: [react(), VitePWA(manifestForPlugin)],
  define: {
    global: 'window',
  },
});
