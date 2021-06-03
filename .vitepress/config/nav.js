import getTags from 'vitepress-tags'

export const pages = getTags('./')

export const nav = [
  {
    text: 'Theory',
    link: '/theory/',
    items: pages.theory,
  },
  {
    text: 'Practice',
    link: '/practice/',
    items: pages.practice,
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
      text: 'Theory',
      link: '/theory/',
      children: pages.theory,
    },
    {
      text: 'Practice',
      link: '/practice/',
      children: pages.practice,
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
