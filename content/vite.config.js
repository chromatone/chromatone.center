import { defineConfig } from 'vite'

import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

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
    envPrefix: ['VITE_'],
    envDir: '../',
    plugins: [
      ViteYaml(),
      Components({
        dirs: ['../components', '../theme/components', '../audio'],
        extensions: ['vue', 'ts', 'js'],
        directoryAsNamespace: true,
        collapseSamePrefixes: true,
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

    ],
    resolve: {
      alias: {
        "#/": path.resolve(dirname, "../"),
        "#/theme": path.resolve(dirname, "../theme"),
        "#/use": path.resolve(dirname, "../use"),
        "#/components/": path.resolve(dirname, "../components"),
        "#/db": path.resolve(dirname, "../db"),
        "#/data": path.resolve(dirname, "../data"),
      }
    },
    ssr: {
      noExternal: ['audiomotion-analyzer', 'fraction.js', 'ol', 'cobe', '@gun-vue/composables', 'drauu', '@tonejs/midi', 'midi-writer-js', 'webchuck']
    },
    build: {
      chunkSizeWarningLimit: 100000,
    },
  })
