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
        audio: resolve(dirname, './audio.js'),
        chroma: resolve(dirname, './chroma.js'),
        loop: resolve(dirname, './loop.js'),
        mic: resolve(dirname, './mic.js'),
        mouse: resolve(dirname, './mouse.js'),
        recorder: resolve(dirname, './recorder.js'),
        midi: resolve(dirname, './midi.js'),
        sequence: resolve(dirname, './sequence.js'),
        soundfont: resolve(dirname, './soundfont.js'),
        tempo: resolve(dirname, './tempo.js'),
        theory: resolve(dirname, './theory.js'),
        tuner: resolve(dirname, './tuner.js'),
        calculations: resolve(dirname, './calculations.js'),
        colors: resolve(dirname, './colors.js'),
      },
      name: 'use-chromatone',
      formats: ["es"],
    },
    chunkSizeWarningLimit: 100000,
    rollupOptions: {
      external: ['vue', '@elemaudio/core', '@elemaudio/web-renderer', 'tone', 'webmidi', 'tonal', 'meyda', 'aubiojs', '@vueuse/core', '@vueuse/math', 'recordrtc', 'colord'],
    },
  },
})
