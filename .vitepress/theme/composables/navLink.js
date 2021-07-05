import { computed, ref } from 'vue'
import { useRoute, withBase } from 'vitepress'

import { isExternal as isExternalCheck } from '../utils.js'

export function useNavLink(item) {
  const route = useRoute()

  const isExternal = isExternalCheck(item.value.link)

  const props = computed(() => {
    const routePath = normalizePath(`/${route.data.relativePath}`)

    let active = false
    if (item.value.activeMatch) {
      active = new RegExp(item.value.activeMatch).test(routePath)
    } else {
      const itemPath = normalizePath(withBase(item.value.link))
      const deepCount = itemPath.substring(1).split('/').length
      if (deepCount < 3) active = itemPath === routePath
      else active = routePath.startsWith(itemPath)
    }

    return {
      class: {
        active,
        isExternal,
      },
      href: isExternal ? item.value.link : withBase(item.value.link),
      target: item.value.target || isExternal ? '_blank' : null,
      rel: item.value.rel || isExternal ? 'noopener noreferrer' : null,
      'aria-label': item.value.ariaLabel,
    }
  })

  return {
    props,
    isExternal,
  }
}

function normalizePath(path) {
  return path
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\.(html|md)$/, '')
    .replace(/\/index$/, '/')
}
