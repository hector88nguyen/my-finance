import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/my-finance/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'My Finance',
        short_name: 'My Finance',
        description: 'Quản lý tài chính cá nhân',
        theme_color: '#863bff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/my-finance/',
        scope: '/my-finance/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/my-finance/index.html',
        navigateFallbackDenylist: [/^\/__/],
        // Take control immediately on update so stale chunks aren't served
        skipWaiting: true,
        clientsClaim: true,
        // Don't cache JS chunks — let browser fetch fresh on each load
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.+\.js$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'js-chunks',
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    exclude: ['tests/**', 'node_modules/**'],
  },
});
