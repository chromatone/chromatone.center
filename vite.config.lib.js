import { defineConfig } from 'vite'
import { resolve } from 'path'


import path from "node:path";
import { fileURLToPath } from "node:url";
import { checker } from 'vite-plugin-checker';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);


export default defineConfig({
  plugins: [
    checker({
      typescript: {
        buildMode: true
      }
    }),
  ],
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'tone', '@tonaljs/tonal', 'colord'],
  },
  publicDir: false,
  resolve: {
    alias: {
      "#": path.resolve(dirname, ".vitepress/"),
    }
  },
  build: {
    outDir: "lib",
    emptyOutDir:false,
    lib: {
      entry: resolve(dirname, '.vitepress/use/index.ts'),
      name: 'use-chromatone',
      fileName: 'use-chromatone',
      formats: ["es"],
    },
    chunkSizeWarningLimit: 100000,
    rollupOptions: {
      external: ['vue'],
      output: {
        manualChunks: {
          tone: ['tone']
        },
      },
    },
  },
})
