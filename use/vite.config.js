import { defineConfig } from 'vite'
import { resolve } from 'path'
import ViteYaml from '@modyfi/vite-plugin-yaml';


import path from "path";
import { fileURLToPath } from "url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);


export default defineConfig({
  plugins: [
    ViteYaml(),
  ],
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'tone', 'tonal', 'colord', 'zzfx'],
  },
  publicDir: 'docs',
  resolve: {
    alias: {
      "#": path.resolve(dirname, "../"),
    }
  },
  build: {
    minify: true,
    outDir: "../lib",
    lib: {
      entry: {
        index: resolve(dirname, './index.js'),
        midi: resolve(dirname, './midi.js'),
        calculations: resolve(dirname, './calculations.js'),
        colors: resolve(dirname, './colors.js'),
      },
      name: 'use-chromatone',
      formats: ["es"],
    },
    chunkSizeWarningLimit: 100000,
    rollupOptions: {
      external: ['vue', '@elemaudio/core', '@elemaudio/web-renderer', 'tone', 'webmidi', 'tonal', 'meyda', 'aubiojs', '@vueuse/core', '@vueuse/math', 'recordrtc'],
    },
  },
})
