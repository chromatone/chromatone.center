import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import WindiCSS from 'vite-plugin-windicss'
import { ViteAliases } from 'vite-aliases'
import AutoImport from 'unplugin-auto-import/vite'
// import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
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
          '@vueuse/core': ['useStorage'],
        },
      ],
    }),
    //@ts-ignore
    ViteAliases({
      dir: '.vitepress',
      deep: false,
      adjustDuplicates: true,
    }),
    Components({
      dirs: ['.vitepress/theme/components', '.vitepress/comps'],
      extensions: ['vue', 'ts','js'],
      directoryAsNamespace: true,
      globalNamespaces: ['global'],
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      exclude: [/node_modules/, /\.git/],
      resolvers: [
        IconsResolver({
          componentPrefix: '',
        }),
      ],
    }),
    Icons({
      defaultStyle: 'vertical-align: middle;',
    }),
    WindiCSS({
      scan: {
        dirs: ['.vitepress', './'],
        include: ['index.md'],
        exclude: ['**/examples/**/*', '/node_modules/'],
        fileExtensions: ['vue', 'ts', 'md'],
      },
    }),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
    //   manifest: {
    //     name: 'Chromatone',
    //     short_name: 'The visual music language',
    //     description: 'Universal color music notation and communication',
    //     theme_color: '#ffffff',
    //     icons: [
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
  optimizeDeps: {
    include: ['vue', '@vueuse/core', 'tone', '@tonaljs/tonal', 'colord'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['@vueuse/motion'],
        },
      },
    },
  },
})
