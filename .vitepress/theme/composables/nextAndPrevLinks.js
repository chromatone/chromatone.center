import { computed } from 'vue'
import { useData } from 'vitepress'
import { isArray, ensureStartingSlash, removeExtension } from '../utils.js'
import { getSideBarConfig, getFlatSideBarLinks } from '../support/sideBar.js'

export function useNextAndPrevLinks() {
  const site = useData()

  const path = computed(() => {
    return removeExtension(ensureStartingSlash(site.page.value.relativePath))
  })

  const candidates = computed(() => {
    const config = getSideBarConfig(site.theme.value.sidebar, path.value)

    return isArray(config) ? getFlatSideBarLinks(config) : []
  })

  const index = computed(() => {
    return candidates.value.findIndex((item) => {
      return item.link === path.value
    })
  })

  const next = computed(() => {
    if (
      site.theme.value.nextLinks !== false &&
      index.value > -1 &&
      index.value < candidates.value.length - 1
    )
      return candidates.value[index.value + 1]
    return null
  })

  const prev = computed(() => {
    if (site.theme.value.prevLinks !== false && index.value > 0)
      return candidates.value[index.value - 1]
    return null
  })

  const hasLinks = computed(() => !!next.value || !!prev.value)

  return {
    next,
    prev,
    hasLinks,
  }
}