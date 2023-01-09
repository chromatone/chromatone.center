import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'


import path from "node:path";
import { fileURLToPath } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);


export default defineConfig({
  base: './',
  plugins: [
    AutoImport({
      // targets to transform
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue\??/, // .vue
      ],
      imports: [
        'vue',
        {
          '@vueuse/core': ['useStorage', 'useRafFn', 'useDark'],
          '@vueuse/math': ['useClamp',]
        },
      ],
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
    lib: {
      entry: resolve(dirname, '.vitepress/use/index.js'),
      name: 'chromatone.center',
      fileName: 'chromatone-center',
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
