export default function (metaData) {
  return function transformHead({ pageData }) {
    const url = pageData.relativePath.split('index.md')[0]
    let image = metaData?.image
    if (pageData.frontmatter?.cover) {

      let fileName = metaData.webp ? pageData.frontmatter?.cover.replace(/\.[^.]+$/, '.webp') : pageData.frontmatter?.cover

      image = `${metaData.mediaFolder || 'media_files'}/cover/${url.split('/').join('-') + fileName}`
    }
    return [

      process.env.NODE_ENV === "production" && metaData.umamiScript && metaData.umamiId ? ["script", { async: true, defer: true, "data-website-id": metaData.umamiId, src: metaData.umamiScript }] : null,

      metaData.icon ? ["link", { rel: "icon", type: "image/svg+xml", href: metaData.url + metaData.icon }] : null,
      metaData?.author ? ["meta", { name: "author", content: metaData?.author }] : null,
      metaData?.tags ? ["meta", { name: "keywords", content: metaData?.tags }] : null,
      metaData.color ? ["meta", { name: "theme-color", content: metaData.color }] : null,

      ["meta", { property: "og:type", content: "website" }],
      metaData.site ? ["meta", { property: "og:site", content: metaData.site }] : null,
      metaData.title ? ["meta", { property: "og:site_name", content: metaData.title }] : null,
      ['meta', { property: 'og:title', content: `${pageData.title} | ${metaData.title}` }],
      ['meta', { property: 'og:description', content: pageData.description }],
      metaData.url ? ['meta', { property: 'og:url', content: metaData.url + url }] : null,
      image && ['meta', { property: 'og:image', content: metaData.url + image }],
      metaData.locale ? ["meta", { property: "og:locale", content: metaData.locale }] : null,

      metaData.title ? ['meta', { name: 'twitter:title', content: `${pageData.title} | ${metaData.title}` }] : null,
      ['meta', { name: 'twitter:description', content: pageData.description }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
      metaData?.author ? ['meta', { name: 'twitter:site', content: `@${metaData.author}` }] : null,
      metaData?.author ? ['meta', { name: 'twitter:creator', content: `@${metaData.author}` }] : null,
      image ? ['meta', { name: 'twitter:image', content: metaData.url + image }] : null,

      ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "white-translucent", },],
      ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
      ["meta", { name: "HandheldFriendly", content: "True" }],
      ["meta", { name: "MobileOptimized", content: "320" }],
    ].filter(Boolean)
  }
}