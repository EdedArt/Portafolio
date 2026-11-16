import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // Three.js se carga en un chunk diferido (fondo y Lab 3D); su tamaño es esperado.
    chunkSizeWarningLimit: 1100,
  },
})
