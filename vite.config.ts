import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    externalConditions: ['require']
  },
  base: '/',  // 强制使用相对路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',  // 静态资源存放目录
  }
})
