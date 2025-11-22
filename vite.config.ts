import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [preact()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/init.tsx'),
      name: 'ChatWidget',
      fileName: () => 'widget.js',
      formats: ['iife'],
    },
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
})
