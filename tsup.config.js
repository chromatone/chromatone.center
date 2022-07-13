import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['.vitepress/use/index.js'],
  sourcemap: true,
  clean: true,
  format: ['esm', 'cjs', 'iife']
})
