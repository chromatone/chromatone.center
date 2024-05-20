import { createContentLoader } from 'vitepress'
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
