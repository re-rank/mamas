import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://port-0-law-backand-mcam616226c24da5.sel5.cloudtype.app',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/init.tsx'),
      name: 'ChatWidget',
      fileName: 'widget',
      formats: ['iife'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'widget.js',
      },
    },
  },
})
