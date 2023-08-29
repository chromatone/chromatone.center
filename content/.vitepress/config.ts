import { defineConfig } from 'vitepress'

//@ts-ignore
import generateMeta from 'vitepress-pages/head'

export const metaData = {
  title: "Chromatone",
  titleTemplate: 'Chromatone.center',
  description: "Visual music language",
  site: "chromatone.center",
  url: "https://chromatone.center/",
  repo: "https://github.com/chromatone/chromatone.center",
  locale: "en",
  icon: "media/logo/click-logo.svg",
  image: "media/logo/cardtw.png",
  author: "davay42",
  twitter: "Chromatone.center",
  tags: "color, music, stickers, posters, theory, webapp, science",
  color: '#cccccc',
  mediaFolder: 'media_files',
  umamiId: "165ab64e-7686-4726-8013-3fa8340dccef",
  umamiScript: "https://stats.chromatone.center/script.js"
};

export default defineConfig({
  lastUpdated: true,
  sitemap: {
    hostname: 'https://chromatone.center'
  },
  outDir: "../dist",
  title: metaData.title,
  titleTemplate: metaData.titleTemplate,
  description: metaData.description,
  lang: metaData.locale,
  themeConfig: {
    logo: "/media/logo/holologo.svg",
    //@ts-expect-error custom icon
    icon: metaData.url + metaData.icon,
    repo: metaData.repo,
  },
  head: [
    ['script', { defer: '', async: '', src: "https://buttons.github.io/buttons.js" }]
  ],
  transformPageData(pageData) {
    if (pageData.frontmatter?.dynamic) {
      pageData.title = pageData.params?.title
      pageData.description = pageData.params?.description
      pageData.frontmatter = { ...pageData.frontmatter, ...pageData.params, cover: pageData.params?.cover ? `https://db.chromatone.center/assets/${pageData.params?.cover}?fit=cover&format=webp&width=1000` : '' }
    }
  },
  transformHead: generateMeta(metaData),

});
