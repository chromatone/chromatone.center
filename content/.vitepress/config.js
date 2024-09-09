import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

export const meta = {
  title: "Chromatone",
  titleTemplate: 'Chromatone.center',
  description: "Visual music language",
  site: "chromatone.center",
  url: "https://chromatone.center/",
  repo: "https://github.com/chromatone/chromatone.center",
  locale: "en",
  icon: "media/logo/click-logo.svg",
  image: "https://chromatone.center/media/logo/cardtw.png",
  author: "davay42",
  twitter: "Chromatone.center",
  tags: "color, music, stickers, posters, theory, webapp, science",
  color: '#cccccc',
  mediaFolder: 'media_files',
  umamiId: "165ab64e-7686-4726-8013-3fa8340dccef",
  umamiScript: "https://stats.chromatone.center/script.js"
};

export default withPwa(defineConfig({
  lastUpdated: true,
  sitemap: {
    hostname: 'https://chromatone.center'
  },

  outDir: "../dist",
  title: meta.title,
  titleTemplate: meta.titleTemplate,
  description: meta.description,
  lang: meta.locale,
  themeConfig: {
    logo: "/media/logo/click-logo.svg",
    icon: meta.url + meta.icon,
    repo: meta.repo,
  },
  head: [
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "white-translucent", },],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "HandheldFriendly", content: "True" }],
    ["meta", { name: "MobileOptimized", content: "320" }],
  ],
  transformPageData(pageData) {
    if (pageData.frontmatter?.dynamic) {
      pageData.title = pageData.params?.title
      pageData.description = pageData.params?.description
      pageData.frontmatter = { ...pageData.frontmatter, ...pageData.params, cover: pageData.params?.cover ? `https://db.chromatone.center/assets/${pageData.params?.cover}?fit=cover&format=webp&width=1000` : '' }
    }
  },
  pwa: {
    selfDestroying: true,
    base: '/',
    scope: '/',
    outDir: '../dist/',
    registerType: 'autoUpdate',
    // injectRegister: 'inline',
    includeAssets: ['/media/logo/logo.svg'],
    workbox: {
      globPatterns: ['**/*.{css,js,html,svg,png,webp,ico,txt,woff2}'],
    },
    manifest: {
      name: 'Chromatone - The Visual Music Language',
      short_name: 'Chromatone',
      theme_color: '#883088',
      display: "standalone",
      icons: [
        {
          src: '/media/logo/holologo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
  },
  transformHead({ pageData }) {
    const url = pageData.relativePath.split('index.md')[0]
    let image = `https://og.chromatone.center/api/image/?text=${encodeURIComponent(pageData?.frontmatter?.title) || ''}`
    if (pageData.frontmatter?.cover) {
      if (pageData.frontmatter.dynamic) {
        image = pageData.frontmatter?.cover
      } else {
        image = meta.url + 'media_files/cover/' + url.split('/').join('-') + pageData.frontmatter?.cover
      }
    }
    return [
      process.env.NODE_ENV === "production" ? ["script", { async: true, defer: true, "data-website-id": "165ab64e-7686-4726-8013-3fa8340dccef", src: "https://stats.chromatone.center/script.js" }] : null,

      meta.icon ? ["link", { rel: "icon", type: "image/svg+xml", href: meta.url + meta.icon }] : null,
      meta?.author ? ["meta", { name: "author", content: meta?.author }] : null,
      meta?.tags ? ["meta", { name: "keywords", content: meta?.tags }] : null,
      meta.color ? ["meta", { name: "theme-color", content: meta.color }] : null,

      ['meta', { property: 'og:title', content: pageData.title + ' | Chromatone.center' }],
      ['meta', { property: 'og:description', content: pageData.description }],
      ['meta', { property: 'og:url', content: meta.url + url }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { name: 'twitter:title', content: pageData.title + ' | Chromatone.center' }],
      ['meta', { name: 'twitter:description', content: pageData.description }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:site', content: `@${meta.author}` }],
      ['meta', { name: 'twitter:creator', content: `@${meta.author}` }],
      ['meta', { name: 'twitter:image', content: image }],
    ]
  },
}))