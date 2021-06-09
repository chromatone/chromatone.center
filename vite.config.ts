import { defineConfig } from 'vite'
import Components from 'vite-plugin-components'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import WindiCSS from 'vite-plugin-windicss'
import { ViteAliases } from 'vite-aliases'


export default defineConfig({
  resolve: {
    //@ts-ignore
		alias: ViteAliases({
      dir: '.vitepress',
      deep: false,
    })
	},
  plugins: [
    Components({
      dirs: [
        '.vitepress/theme/components',
        '.vitepress/components',
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
      '@tonaljs/tonal'
    ],
  },
  build: {
    rollupOptions:{
      output:{
        manualChunks: {
          motion: ['@vueuse/motion'],
        }
      }
    }
  }
})


