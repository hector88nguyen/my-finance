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
        // Only precache static shell — NOT JS/CSS chunks (they change every deploy)
        globPatterns: ['**/*.{html,ico,png,svg,woff2}'],
        navigateFallback: '/my-finance/index.html',
        navigateFallbackDenylist: [/^\/__/],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            // JS and CSS chunks: always try network first, cache as fallback
            urlPattern: /\/assets\/.+\.(js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-chunks',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
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
