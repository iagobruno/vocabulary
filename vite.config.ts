import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/vocabulary/' : '/',
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icon.png'],
      manifest: false,
      workbox: {
        cleanupOutdatedCaches: true,
        // Padrão de arquivos para cachear na instalação do SW
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,woff2}'],
        // Cache runtime para recursos externos (opcional)
        runtimeCaching: [
          {
            // Cache para as fontes do Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 1 mês
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
});
