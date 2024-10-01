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
  build: {
    minify: true,
    outDir: "./dist",
    lib: {
      entry: resolve(dirname, './index.js'),
      name: 'chromatone-db',
      fileName: 'index',
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        preserveModules: true,
        entryFileNames: '[name].js'
      },
    },
  },
})
