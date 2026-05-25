import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Increase chunk size warning limit slightly
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — loaded first, cached permanently
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase — large but cached after first load
          'firebase-vendor': [
            'firebase/app',
            'firebase/auth',
            'firebase/firestore',
          ],
          // Icons library
          'icons': ['react-icons/fi', 'react-icons/gi', 'react-icons/md'],
        },
      },
    },
  },
})
