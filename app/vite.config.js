import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@logic': path.resolve(__dirname, './src/logic'),
      '@view': path.resolve(__dirname, './src/view'),
      '@util': path.resolve(__dirname, './src/util'),
      '@context': path.resolve(__dirname, './src/context')
    }
  }
})