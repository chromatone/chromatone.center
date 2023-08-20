import { useItems } from "../../../db"

export default {
  async load() {
    const posts = await useItems('devlog')

    return posts.map(p => ({
      frontmatter: {
        ...p,
        cover: `https://db.chromatone.center/assets/${p.cover}`
      },
      url: p.slug
    }))
  }
}