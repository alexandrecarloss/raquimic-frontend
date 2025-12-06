import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    chunkSizeWarningLimit: 1500, // aumenta limite para 1.5mb
  },
  server: {
    historyApiFallback: true, 
  }
});
