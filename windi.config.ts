//@ts-ignore
import { defineConfig } from 'windicss/helpers'
import colors from 'windicss/colors'


export default defineConfig({
  darkMode: 'class',
  shortcuts: {
    bc: 'border-gray-300 dark:border-true-gray-600',
  },
  plugins: [
    require('windicss/plugin/scroll-snap')
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: 'var(--font-family-base)',
        mono: 'var(--font-family-mono)',
      },
      screens: {
        xs: '420px',
        md: '720px',
      },
      backgroundColor: {
        ...chromaticColors(12),
        ...chromaticColors(7),
        ...chromaticColors(6),
        ...chromaticColors(5),
        ...chromaticColors(4),
        ...chromaticColors(3),
      },
      colors: {
        bg: 'var(--c-bg)',
        ...chromaticColors(12),
        gray: colors.trueGray,
        tg: colors.trueGray,
      },
      boxShadow: {
        box: '0px 5px 15px 0px rgba(0, 0, 0, 0.35)',
      },
    },
  },
})


function chromaticColors(n:number) {
  let colors = {}
    for (let i=0;i<n;i++) {
    colors['ch-'+n+'-'+i] = `hsla(${i*(360/n)}, 60%, 80%, 1)`
    colors['ch-'+n+'-'+i+'d'] = `hsla(${i*(360/n)}, 60%, 20%, 1)`
  }
  return colors
}