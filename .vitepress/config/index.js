import { metaData } from './constants.js'
import head from './head.js'
import { nav, sidebar, pages } from './nav.js'

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
      description: 'Визуально-музыкальный язык - русская версия',
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
        label: 'Russian',
        selectText: 'Ru',
        lang: 'ru-RU',
        title: 'Хроматон',
        description: 'Визуально-музыкальный язык - русская версия',
        nav: [
          {
            text: 'Контакты',
            link: '/ru/contact.html',
          },
        ],
        sidebar,
      },
    },
    repo: '',
    logo: '/media/circle/circle.svg',
    docsDir: '.',
    docsBranch: 'master',
    docsRepo: '',
    editLinks: false,
    editLinkText: 'Нашли ошибку?',
    nav,
    sidebar,
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-classy'))
      md.use(require('markdown-it-container'), 'card')
      md.use(require('markdown-it-external-links'), {
        internalDomains: ['localhost', 'starovdenis.com'],
      })
    },
  },
  customData: {
    pages: pages,
  },
}

export default config
