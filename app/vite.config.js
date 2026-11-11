import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(rootDir, './src'),
      '@logic': path.resolve(rootDir, './src/logic'),
      '@view': path.resolve(rootDir, './src/view'),
      '@util': path.resolve(rootDir, './src/util'),
      '@context': path.resolve(rootDir, './src/context')
    }
  }
})