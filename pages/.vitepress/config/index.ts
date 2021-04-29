import { UserConfig } from 'vitepress'
import { DefaultTheme } from '../theme/config'
import { metaData } from './constants'
import head from './head'
//@ts-ignore
import getTags from 'vitepress-tags'

const pages = getTags()

const config: UserConfig<DefaultTheme.Config> = {
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
    nav: [
      {
        text: 'Theory',
        link: '/theory/',
        //@ts-ignore
        items: pages.theory
      },
      {
        text: 'Apps',
        link: '/apps/',
        //@ts-ignore
        items: pages.apps
      },
      {
        text: 'Shop',
        link: '/shop/',
        //@ts-ignore
        items: pages.shop
      },
      {
        text: 'Support',
        link: '/support.html',
        //@ts-ignore
        items: pages.support
      },
      {
        text: 'Contact',
        link: '/contact.html',
        //@ts-ignore
        items: pages.contact
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Theory',
          link: '/theory/',
          //@ts-ignore
          children: pages.theory
        },
        {
          text: 'Apps',
          link: '/apps/',
          //@ts-ignore
          children: pages.apps
        },
        {
          text: 'Shop',
          link: '/shop/',
          //@ts-ignore
          children: pages.shop
        },
        {
          text: 'Support',
          link: '/support/',
          //@ts-ignore
          children: pages.support
        },
        {
          text: 'Contact',
          link: '/contact.html',
          //@ts-ignore
          children: pages.contact
        },
      ],
    },
  },
  markdown: {
    config: (md) => {
      md.use(require('markdown-it-classy'));
      md.use(require('markdown-it-container'), 'card')
      md.use(require('markdown-it-external-links'), {
        internalDomains: ['localhost','starovdenis.com']
      })
    }
  },
  customData: {
    pages: pages
  }
}

export default config
