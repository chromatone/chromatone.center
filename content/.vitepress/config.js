import { defineConfig } from 'vitepress'
import { withPwa } from '@vite-pwa/vitepress'

export default withPwa(defineConfig({
  lastUpdated: true,
  sitemap: {
    hostname: 'https://chromatone.center'
  },
  outDir: "../dist",
  title: "Chromatone",
  titleTemplate: 'Chromatone.center',
  description: "Visual music language",
  lang: "en",
  themeConfig: {
    socialLinks: []
  },
  head: [
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "white-translucent", },],
    ["meta", { name: "mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "HandheldFriendly", content: "True" }],
    ["meta", { name: "MobileOptimized", content: "320" }],
    ["link", { rel: "alternate", type: "application/rss+xml", href: '/feed.rss' }],
  ],
  transformPageData(pageData) {
    if (pageData.frontmatter?.dynamic) {
      pageData.title = pageData.params?.title
      pageData.description = pageData.params?.description
      pageData.frontmatter = { ...pageData.frontmatter, ...pageData.params, cover: pageData.params?.cover ? `https://db.chromatone.center/assets/${pageData.params?.cover?.id}?fit=cover&format=webp&width=1000` : '' }
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
      theme_color: '#cccccc',
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
        image = 'https://chromatone.center/media_files/cover/' + url.split('/').join('-') + pageData.frontmatter?.cover
      }
    }
    return [
      process.env.NODE_ENV === "production" && ["script", { async: true, defer: true, "data-website-id": "165ab64e-7686-4726-8013-3fa8340dccef", src: "https://stats.chromatone.center/script.js" }],

      ["link", { rel: "icon", type: "image/svg+xml", href: "https://chromatone.center/media/logo/click-logo.svg" }],
      ["meta", { name: "author", content: "davay42" }],
      ["meta", { name: "keywords", content: "color, music, stickers, posters, theory, webapp, science" }],
      ["meta", { name: "theme-color", content: '#cccccc' }],

      ['meta', { property: 'og:title', content: pageData.title + ' | Chromatone.center' }],
      ['meta', { property: 'og:description', content: pageData.description }],
      ['meta', { property: 'og:url', content: "https://chromatone.center/" + url }],
      ['meta', { property: 'og:image', content: image }],
      ['meta', { name: 'twitter:title', content: pageData.title + ' | Chromatone.center' }],
      ['meta', { name: 'twitter:description', content: pageData.description }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      ['meta', { name: 'twitter:site', content: `@davay42` }],
      ['meta', { name: 'twitter:creator', content: `@davay42` }],
      ['meta', { name: 'twitter:image', content: image }],
      ['meta', { 'http-equiv': "Permissions-Policy", content: "microphone=src" }]
    ]
  },
}))