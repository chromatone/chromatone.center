import { useData } from 'vitepress'

export function useSiblings() {
  const { site, frontmatter, page } = useData()
  const tags = frontmatter.value.tags
  const pages = site.value.customData.pages
  let prev, next
  if (tags && typeof tags == 'string' && pages[tags]) {
    const index = pages[tags].findIndex((el) => el.title == page.value.title)
    if (index >= 0 && index <= pages[tags].length) {
      next = pages[tags][index + 1]
    }
    if (index > 0) {
      prev = pages[tags][index - 1]
    }
  }

  return { prev, next }
}

export function useParents() {
  const { site, frontmatter } = useData()
  const tag = frontmatter.value.tags
  const pages = site.value.customData.pages
  const parents = []
  pages.all.forEach((page) => {
    if (tag && typeof tag == 'string' && tag == page.data?.list) {
      parents.push(page)
    }
  })
  return parents
}
