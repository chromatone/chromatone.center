import { useData } from 'vitepress'

export function useSiblings() {
  const { theme, frontmatter, page } = useData()
  const prev = ref()
  const next = ref()
  const total = ref()
  const current = ref()

  watchEffect(() => {
    const tags = frontmatter.value.tags
    const pages = theme.value?.pages
    if (tags && typeof tags == 'string' && pages[tags]) {
      const index = pages[tags].findIndex((el) => el.title == page.value.title)
      total.value = pages[tags].length
      current.value = index
      if (index >= 0 && index <= pages[tags].length) {
        next.value = pages[tags][index + 1]
      } else {
        next.value = null
      }
      if (index > 0) {
        prev.value = pages[tags][index - 1]
      } else {
        prev.value = null
      }
    }
  })
  return { prev, next, current, total }
}

export function useParents() {
  const { theme, frontmatter } = useData()
  const parents = ref([])
  watchEffect(() => {
    let tag = frontmatter.value.tags
    const pages = theme.value.pages
    parents.value = []
    for (let p = 0; p < 5; p++) {
      if (tag == 'main') continue
      let page = pages.all.find((pg) => tag && pg.data?.list == tag)
      if (page) {
        parents.value.push(page)
      } else {
        continue
      }
      tag = page.data?.tags
    }
    parents.value = [...parents.value.reverse()]
  })

  return parents
}
