import { defineConfig } from 'vite'
import Components from 'vite-plugin-components'
import Icons, { ViteIconsResolver } from 'vite-plugin-icons'
import WindiCSS from 'vite-plugin-windicss'
import ViteRestart from 'vite-plugin-restart'
import { getAliases } from 'vite-aliases'



export default defineConfig({
  resolve: {
		alias: getAliases({
      path: 'pages/.vitepress/theme'
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
        dirs: ['.vitepress', '.vitepress/components'],
        include: ['index.md'],
        exclude: ['**/examples/**/*'],
        fileExtensions: ['vue', 'ts'],
      },
    }),
    //  ViteRestart({
    //    restart: ['.vitepress/config/*.*', 'pages/*.md'],
    //  }),
  ],
  optimizeDeps: {
    include: [
      'vue',
      '@vueuse/core',
    ],
  },
  build: {
    rollupOptions:{
      output:{
        manualChunks: {
          motion: ['@vueuse/motion']
        }
      }
    }
  }
})


