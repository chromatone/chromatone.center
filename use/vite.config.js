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
    include: ['vue', '@vueuse/core', 'tone', 'tonal', 'colord'],
  },
  publicDir: false,
  resolve: {
    alias: {
      "#": path.resolve(dirname, "../"),
    }
  },
  build: {
    minify: true,
    outDir: "../lib",
    lib: {
      entry: resolve(dirname, './index.js'),
      name: 'use-chromatone',
      fileName: 'use-chromatone',
      formats: ["es"],
    },
    chunkSizeWarningLimit: 100000,
    rollupOptions: {
      external: ['vue'],
      output: {
        manualChunks: {
          tone: ['tone', '@tonejs/midi'],
          webmidi: ['webmidi'],
        },
      },
    },
  },
})
