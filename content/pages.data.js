import { createContentLoader } from 'vitepress'
//@ts-ignore
import VPMedia from '../pages/media'


const pages = createContentLoader('./**/[!/[]*/index.md', {
  includeSrc: true,
  transform: VPMedia({
    root: new URL('./', import.meta.url),
    mediaTypes: {
      cover: { size: 1200, height: 1000, fit: "inside" }
    }
  })
})

export default pages

// import fs from 'fs'

// const list = (await pages.load()).filter(el => el.url.includes('dev')).map(el => {
//   return {
//     ...el.frontmatter,
//     content: el.src,
//     cover: ''
//   }
// })

// fs.writeFileSync('./dev.json', JSON.stringify(list))