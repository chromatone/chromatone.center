import getTags from 'vitepress-tags'

export const pages = getTags('./')

export const nav = [
  {
    text: 'Learn',
    link: '/learn/',
    items: pages.theory,
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
      text: 'Learn',
      link: '/learn/',
      children: pages.theory,
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
