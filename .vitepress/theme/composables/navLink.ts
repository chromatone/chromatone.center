import { computed, Ref } from 'vue'
import { useRoute } from 'vitepress'
import type { DefaultTheme } from '../config'
import { isExternal as isExternalCheck } from '../utils'
import { useUrl } from '../composables/url'

export function useNavLink(item: Ref<DefaultTheme.NavItemWithLink>) {
  const route = useRoute()
  const { withBase } = useUrl()

  const isExternal = isExternalCheck(item.value.link)

  const props = computed(() => {
    const routePath = normalizePath(`/${route.data.relativePath}`)

    let active = false
    if (item.value.activeMatch) {
      active = new RegExp(item.value.activeMatch).test(routePath)
    }
    else {
      const itemPath = normalizePath(withBase(item.value.link))
      const deepCount = itemPath.substring(1).split('/').length
      if (deepCount < 3)
        active = itemPath === routePath
      else
        active = routePath.startsWith(itemPath)
    }

    return {
      'class': {
        active,
        isExternal,
      },
      'href': isExternal ? item.value.link : withBase(item.value.link),
      'target': item.value.target || isExternal ? '_blank' : null,
      'rel': item.value.rel || isExternal ? 'noopener noreferrer' : null,
      'aria-label': item.value.ariaLabel,
    }
  })

  return {
    props,
    isExternal,
  }
}

function normalizePath(path: string): string {
  return path
    .replace(/#.*$/, '')
    .replace(/\?.*$/, '')
    .replace(/\.(html|md)$/, '')
    .replace(/\/index$/, '/')
}
