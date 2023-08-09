import { defineConfig } from 'vitepress'

import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { SitemapStream } from 'sitemap'

//@ts-ignore
import generateMeta from 'vitepress-pages/head'

const links = []


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
  transformHead: generateMeta(metaData),
  transformHtml: (_, id, { pageData }) => {
    if (!/[\\/]404\.html$/.test(id))
      links.push({
        // you might need to change this if not using clean urls mode
        url: pageData.relativePath?.replace(/((^|\/)index)?\.md$/, '$2'),
        lastmod: pageData?.lastUpdated,
        changefreq: 'weekly'
      })
  },
  buildEnd: async ({ outDir }) => {
    const sitemap = new SitemapStream({ hostname: metaData.url })
    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'))
    sitemap.pipe(writeStream)
    links.forEach((link) => sitemap.write(link))
    sitemap.end()
    await new Promise((r) => writeStream.on('finish', r))
  }
});
