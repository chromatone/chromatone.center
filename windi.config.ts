import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'
import snap from 'windicss/plugin/scroll-snap'
import filters from 'windicss/plugin/filters'


export default defineConfig({
  separator: "_",
  darkMode: 'class',
 
  plugins: [
    snap,
    filters
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
