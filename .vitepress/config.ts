import { defineConfig } from 'vitepress'

import mdLinks from "markdown-it-external-links";

const isProd = process.env.NODE_ENV === "production";

const site = isProd ? "https://chromatone.center/" : "http://localhost:3000";

export const metaData = {
  title: "Chromatone",
  titleTemplate: 'Chromatone center',
  description: "Universal color music notation and communication",
  site,
  locale: "en",
  icon: "/media/logo/holologo.svg",
  image: "media/logo/cardtw.png",
  author: "davay42",
  twitter: "Chromatone.center",
  tags: "color, music, stickers, posters, theory, webapp, science",
};

export default defineConfig({
  title: metaData.title,
  titleTemplate: metaData.titleTemplate,
  description: metaData.description,
  lang: metaData.locale,
  transformHead(ctx) {
    const url = ctx.pageData.relativePath.split('index.md')[0]
    let image = metaData?.image
    if (ctx.pageData.frontmatter?.cover) {
      image = 'media_files/cover/' + url.split('/').join('-') + ctx.pageData.frontmatter?.cover
    }
    return [
      ['meta', { property: 'og:title', content: ctx.pageData.title+ '| Chromatone' }],
      ['meta', { property: 'og:description', content: ctx.pageData.description }],
      ['meta', { property: 'og:url', content: site + url }],
      ['meta', { property: 'og:image', content: site + image }],
      ['meta', { name: 'twitter:title', content: ctx.pageData.title + '| Chromatone' }],
      ['meta', { name: 'twitter:description', content: ctx.pageData.description }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:site', content: `@${metaData?.author}` }],
      ['meta', { name: 'twitter:creator', content: `@${metaData?.author}` }],
      ['meta', { name: 'twitter:image', content: site + image }],
    ]
  },
  head: [
    ["script", { async: 'true', defer: 'true', "data-website-id": "0abe9f0f-2fc2-4df1-8f42-0844ddcb2042", src: "https://stats.defucc.me/umami.js" }],
    ['meta', { name: 'robots', content: 'index, follow' }],
    ['meta', { name: 'author', content: metaData?.author }],
    ['meta', { name: 'keywords', content: metaData?.tags }],
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['link', { rel: 'manifest', href: './manifest.json' }],
    [
      'link',
      {
        rel: 'alternate icon',
        sizes: '16x16',
        type: 'image/png',
        href: '/favicon.ico',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '512x512',
        href: '/media/logo/holologo.png',
      },
    ],
    ['link', { rel: 'mask-icon', color: '#ffffff', href: '/favicon.svg' }],
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
    ['meta', { property: 'og:type', content: 'article' }],
    ['meta', { property: 'og:locale', content: metaData.locale }],
    ['meta', { property: 'og:site', content: metaData.site }],
    ['meta', { property: 'og:site_name', content: metaData.title }],
  ],
  themeConfig: {
    logo: "/media/logo/holologo.svg",
    //@ts-expect-error custom icon
    icon: metaData.icon,
    repo: "https://github.com/chromatone/chromatone.center",
  },
  markdown: {
    config: (md) => {
      md.use(mdLinks, {
        internalDomains: ["localhost", "chromatone.center"],
      });
    },
  },
});
