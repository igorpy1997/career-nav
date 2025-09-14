import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Корневая папка проекта
  root: './frontend',

  // Папка со статическими файлами (относительно root)
  publicDir: 'public',

  // Настройки сборки
  build: {
    // Папка вывода (относительно корня всего проекта)
    outDir: '../dist',

    // Очищать папку dist перед сборкой
    emptyOutDir: true,

    // Минификация
    minify: 'esbuild',

    // Настройки Rollup
    rollupOptions: {
      output: {
        // Структура файлов в dist
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name].[ext]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash].[ext]`;
          }
          return `assets/[name]-[hash].[ext]`;
        }
      }
    }
  },

  // Настройки CSS
  css: {
    preprocessorOptions: {
      scss: {}
    }
  },

  // Настройки dev сервера
  server: {
    port: 3000,
    open: true
  },

  // Настройки preview сервера
  preview: {
    port: 4173
  }
})