import { metaData } from './constants'

const head = [
  ['meta', { name: 'author', content: metaData?.author }],
  ['meta', { name: 'keywords', content: metaData?.tags }],
  ['link', { rel: 'icon', type: 'image/svg+xml', href: metaData.icon }],
  [
    'meta',
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'white-translucent',
    },
  ],
  ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ['meta', { name: 'HandheldFriendly', content: 'True' }],
  ['meta', { name: 'MobileOptimized', content: '320' }],
  ['meta', { name: 'theme-color', content: '#0ea5e9' }],

  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'twitter:site', content: metaData?.site }],
  ['meta', { name: 'twitter:title', value: metaData?.title }],
  ['meta', { name: 'twitter:description', value: metaData.description }],
  //@ts-ignore
  ['meta', { name: 'twitter:image', content: metaData?.image }],

  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:locale', content: metaData.locale }],
  ['meta', { property: 'og:site', content: metaData.site }],
  ['meta', { property: 'og:site_name', content: metaData.title }],
  ['meta', { property: 'og:title', content: metaData.title }],
  //@ts-ignore
  ['meta', { property: 'og:image', content: metaData?.image }],
  ['meta', { property: 'og:description', content: metaData.description }],

  // ['link', { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' }],
  // ['link', { rel: 'preconnect', crossorigin: 'anonymous', href: 'https://fonts.gstatic.com' }],
  // ['link', { href: 'https://fonts.googleapis.com/css2?family=Commissioner:wght@200;400;500;600&display=swap', rel: 'stylesheet' }],
]

export default head
