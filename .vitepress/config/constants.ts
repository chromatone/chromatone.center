const isProd = process.env.NODE_ENV === 'production'

const site = isProd ? 'https://www.chromatone.center' : 'http://localhost:3000'

export const metaData = {
  title: 'Chromatone',
  description: 'The visual music language',
  site,
  locale: 'en',
  icon: '/media/circle/circle.svg',
  author: 'Chromatone.center',
  tags: 'color, music, stickers, posters, theory, webapp, science',
}
