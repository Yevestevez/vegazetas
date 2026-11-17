import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    target: ['chrome87', 'edge88', 'firefox78', 'safari14']
  },
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
      '@logic': path.resolve(rootDir, './src/logic'),
      '@view': path.resolve(rootDir, './src/view'),
      '@util': path.resolve(rootDir, './src/util'),
      '@context': path.resolve(rootDir, './src/context'),
      'com': path.resolve(rootDir, '../com')
    },
    preserveSymlinks: true
  }
})
