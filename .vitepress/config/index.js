import { metaData } from './constants.js'
import head from './head.js'
import { nav, sidebar, pages } from './nav.js'

const config = {
  title: metaData.title,
  description: metaData.description,
  lang: metaData.locale,
  head,
  themeConfig: {
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
