import { defineConfig } from 'vite'
import Components from 'vite-plugin-components'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import WindiCSS from 'vite-plugin-windicss'
import { ViteAliases } from 'vite-aliases'
import AutoImport from 'unplugin-auto-import/vite'


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
          '@vueuse/core': [
            'useStorage'
          ],
        }
      ],
    }),
    //@ts-ignore
    ViteAliases({
      dir: '.vitepress',
      deep: false,
      adjustDuplicates:true
    }),
    Components({
      dirs: [
        '.vitepress/theme/components',
        '.vitepress/comps',
      ],
      extensions: ['vue', 'ts'],
      directoryAsNamespace: true,
      globalNamespaces: ['global'],
      customLoaderMatcher: id => id.endsWith('.md'),
      customComponentResolvers: [
        ViteIconsResolver({
          componentPrefix: '',
        }),
      ],
    }),
    Icons({
      defaultStyle: 'vertical-align: middle;',
    }),
    WindiCSS({
      scan: {
        dirs: ['.vitepress'],
        include: ['index.md'],
        exclude: ['**/examples/**/*'],
        fileExtensions: ['vue', 'ts'],
      },
    }),

  ],
  optimizeDeps: {
    include: [
      'vue',
      '@vueuse/core',
      'tone',
      '@tonaljs/tonal',
      'colord',
    ],
  },
  build: {
    rollupOptions:{
      output:{
        manualChunks: {
          motion: ['@vueuse/motion'],
          tone: ['tone'],
        }
      }
    }
  }
})


