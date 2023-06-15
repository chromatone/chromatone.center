import { createContentLoader } from 'vitepress'

import VPMedia from 'vitepress-pages/media'

export default createContentLoader('./**/*/index.md', {
  transform: VPMedia({
    root: new URL('./', import.meta.url),
    mediaTypes: {
      cover: { size: 1200, height: 1000, fit: "inside" }
    }
  })
})