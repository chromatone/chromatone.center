import { metaData } from './constants.js'
import head from './head.js'
import { nav, sidebar, pages, ru_nav, ru_sidebar } from './nav.js'

const config = {
  title: metaData.title,
  description: metaData.description,
  lang: metaData.locale,
  head,
  locales: {
    '/': {
      lang: 'en-US',
      title: metaData.title,
      description: metaData.description,
    },
    '/ru/': {
      lang: 'ru-RU',
      title: 'Хроматон',
      description: 'Визуально-музыкальный язык',
    },
  },
  themeConfig: {
    locales: {
      '/': {
        label: 'English',
        selectText: 'En',
        nav,
        sidebar,
        lang: 'en-US',
        title: metaData.title,
        description: metaData.description,
      },
      '/ru/': {
        label: 'Русский',
        selectText: 'Ru',
        lang: 'ru-RU',
        title: 'Хроматон',
        description: 'Визуально-музыкальный язык',
        nav: ru_nav,
        sidebar: ru_sidebar,
      },
    },
    logo: '/media/logo/holologo.svg',
    icon: 'media/logo/icon.svg',
    repo: 'https://github.com/chromatone/chromatone.center',
    pages,
    nav,
    sidebar,
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-classy'))
      md.use(require('markdown-it-container'), 'card')
      md.use(require('markdown-it-external-links'), {
        internalDomains: ['localhost', 'chromatone.center'],
      })
    },
  },
}

export default config
