import { defineConfig } from 'vite'
import Pages from "vite-plugin-pages";
import { extendRoutes } from "vitepress-pages";
import generateSitemap from 'vite-plugin-pages-sitemap'

import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

import { VitePWA } from 'vite-plugin-pwa'


import ViteYaml from '@modyfi/vite-plugin-yaml';

import Unocss from 'unocss/vite'
import { transformerDirectives, presetIcons, presetUno, extractorSplit } from 'unocss'
import extractorPug from '@unocss/extractor-pug'

import path from "node:path";
import { fileURLToPath } from "node:url";


const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(
  {
    base: './',
    envPrefix: ['VITE_', 'TAURI_'],
    envDir: '../',
    plugins: [
      ViteYaml(),
      Pages({
        dirs: [
          { dir: ".", baseRoute: "" },
        ],
        exclude: ['**/node_modules/**/*.*', '**/!(index).md', '**/shop/success.md', '**/shop/cancel.md', '**/src-tauri/**/*.*'],
        extensions: ['md'],
        ...extendRoutes({
          root: dirname,
          mediaTypes: {
            cover: { size: 1200, height: 800, fit: "inside" },
            icon: { width: 200, height: 200, fit: "inside" }
          }
        }),
        onRoutesGenerated: routes => (generateSitemap({ routes, hostname: 'https://chromatone.center', dest: "content/public" })),
      }),
      Components({
        dirs: ['../components', '../theme/components'],
        extensions: ['vue', 'ts', 'js'],
        directoryAsNamespace: true,
        globalNamespaces: ['global'],
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        exclude: [/node_modules/, /\.git/],
        resolvers: [
          IconsResolver({
            componentPrefix: 'i',
          }),
        ],
      }),
      Icons({
        defaultStyle: 'vertical-align: middle;',
      }),
      Unocss({
        transformers: [
          transformerDirectives(),
        ],
        presets: [
          presetIcons({
            scale: 1.2,
            extraProperties: {
              'vertical-align': 'middle'
            }
          }),
          presetUno(),
        ],
        extractors: [
          extractorSplit,
          extractorPug()
        ]
      }),
      // VitePWA({
      //   registerType: 'autoUpdate',
      //   includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      //   manifest: {
      //     name: 'Chromatone',
      //     short_name: 'The visual music language',
      //     description: 'Universal color music notation and communication',
      //     "display": "standalone",
      //     "homepage_url": "https://chromatone.center",
      //     theme_color: '#333333',
      //     "providedBy": {
      //       "name": "Chromatone",
      //       "url": "https://chromatone.center"
      //     },
      //     icons: [
      //       {
      //         "src": "./media/logo/holologo.svg",
      //         "type": "image/svg+xml",
      //         "sizes": "512x512"
      //       },
      //       {
      //         src: 'pwa-192x192.png',
      //         sizes: '192x192',
      //         type: 'image/png',
      //       },
      //       {
      //         src: 'pwa-512x512.png',
      //         sizes: '512x512',
      //         type: 'image/png',
      //       },
      //       {
      //         src: 'pwa-512x512.png',
      //         sizes: '512x512',
      //         type: 'image/png',
      //         purpose: 'any maskable',
      //       }
      //     ]
      //   }
      // }),
    ],
    resolve: {
      alias: {
        "#/": path.resolve(dirname, "../"),
        "#/theme": path.resolve(dirname, "../theme"),
        "#/use": path.resolve(dirname, "../use"),
        "#/components/": path.resolve(dirname, "../components"),
        "#/db": path.resolve(dirname, "../db"),
      }
    },
    optimizeDeps: {
      include: ['vue', '@vueuse/core', 'tone', '@tonaljs/tonal', 'colord'],
    },
    ssr: {
      noExternal: ['audiomotion-analyzer', 'fraction.js', 'tone', 'ol', 'cobe', '@gun-vue/composables', 'drauu', '@tonejs/midi', 'midi-writer-js', 'webchuck']
    },
    build: {
      chunkSizeWarningLimit: 100000,
      rollupOptions: {
        output: {
          manualChunks: {
            tone: ['tone']
          },
        },
      },
    },
  })
