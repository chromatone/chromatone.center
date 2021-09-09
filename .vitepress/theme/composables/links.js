import { useData } from 'vitepress'

export function useSiblings() {
  const { theme, frontmatter, page } = useData()
  const tags = frontmatter.value.tags
  const pages = theme.value?.pages
  let prev, next, total, current
  if (tags && typeof tags == 'string' && pages[tags]) {
    const index = pages[tags].findIndex((el) => el.title == page.value.title)
    total = pages[tags].length
    current = index
    if (index >= 0 && index <= pages[tags].length) {
      next = pages[tags][index + 1]
    }
    if (index > 0) {
      prev = pages[tags][index - 1]
    }
  }
  return { prev, next, current, total }
}

export function useParents() {
  const { theme, frontmatter } = useData()
  let tag = frontmatter.value.tags
  const pages = theme.value?.pages
  const parents = []
  for (let p = 0; p < 5; p++) {
    if (tag == 'main') continue
    let page = pages.all.find((pg) => tag && pg.data?.list == tag)
    if (page) {
      parents.push(page)
    } else {
      continue
    }
    tag = page.data?.tags
  }

  return parents.reverse()
}
