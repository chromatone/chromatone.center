import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'


export default defineConfig({
  darkMode: 'class',
  shortcuts: {
    bc: 'border-gray-300 dark:border-true-gray-600',
    'has-bg': 'bg-light-500 dark:bg-dark-500',
  },
  plugins: [
    require('windicss/plugin/scroll-snap'),
    require('windicss/plugin/filters')
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-family-base)',
        mono: 'var(--font-family-mono)',
      },
      screens: {
        xs: '340px',
        md: '720px',
      },
      colors: {
        bg: 'var(--c-bg)',
        gray: colors.trueGray,
        tg: colors.trueGray,
      },
      cursor: {
        'crosshair':'crosshair',
      },
      boxShadow: {
        box: '0px 5px 15px 0px rgba(0, 0, 0, 0.35)',
      },
    },
  },
})
