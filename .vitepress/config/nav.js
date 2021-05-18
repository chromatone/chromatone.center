import getTags from 'vitepress-tags'

export const pages = getTags('./')

export const nav = [
  {
    text: 'Research',
    link: '/research/',
    items: pages.research,
  },
  {
    text: 'Explore',
    link: '/explore/',
    items: pages.apps,
  },
  {
    text: 'Shop',
    link: '/shop/',
    items: pages.shop,
  },
  {
    text: 'Support',
    link: '/support/',
    items: pages.support,
  },
  {
    text: 'Contact',
    link: '/contact/',
    items: pages.contact,
  },
]

export const sidebar = {
  '/': [
    {
      text: 'Research',
      link: '/research/',
      children: pages.reserch,
    },
    {
      text: 'Explore',
      link: '/explore/',
      children: pages.apps,
    },
    {
      text: 'Shop',
      link: '/shop/',
      children: pages.shop,
    },
    {
      text: 'Support',
      link: '/support/',
      children: pages.support,
    },
    {
      text: 'Contact',
      link: '/contact/',
      children: pages.contact,
    },
  ],
}
