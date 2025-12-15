import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/EFT-builds/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // ADD THIS PROXY CONFIGURATION BLOCK
  server: {
    proxy: {
      '/graphql': {
        target: 'https://api.tarkov.dev/graphql',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/graphql/, ''),
      },
    },
  },
})
