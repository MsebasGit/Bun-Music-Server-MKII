import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    proxy: {
      // Redirige las llamadas a la API
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      // AGREGA ESTO: Redirige las imágenes al backend
      '/img': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
      // AGREGA ESTO: Redirige el audio al backend
      '/music': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      }
    }
  }
})