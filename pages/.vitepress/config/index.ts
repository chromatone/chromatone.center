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
        text: 'Research',
        link: '/research/',
        //@ts-ignore
        items: pages.research
      },
      {
        text: 'Explore',
        link: '/explore/',
        //@ts-ignore
        items: pages.explore
      },
      {
        text: 'Memorize',
        link: '/memorize/',
        //@ts-ignore
        items: pages.memorize
      },
      {
        text: 'Practice',
        link: '/practice/',
        //@ts-ignore
        items: pages.practice
      },
      {
        text: 'Express',
        link: '/express/',
        //@ts-ignore
        items: pages.express
      },
      {
        text: 'Contribute',
        link: '/contribute/',
        //@ts-ignore
        items: pages.contribute
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
          text: 'Research',
          link: '/research/',
          //@ts-ignore
          children: pages.research
        },
        {
          text: 'Explore',
          link: '/explore/',
          //@ts-ignore
          children: pages.explore
        },
        {
          text: 'Memorize',
          link: '/memorize/',
          //@ts-ignore
          children: pages.memorize
        },
        {
          text: 'Practice',
          link: '/practice/',
          //@ts-ignore
          children: pages.practice
        },
        {
          text: 'Express',
          link: '/express/',
          //@ts-ignore
          children: pages.express
        },
        {
          text: 'Contribute',
          link: '/contribute/',
          //@ts-ignore
          children: pages.contribute
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
