import { computed } from 'vue'
import { useRoute, useData, inBrowser } from 'vitepress'

export function useLocaleLinks() {
  const route = useRoute()
  const site = useData()

  return computed(() => {
    const theme = site.theme
    const locales = theme.value.locales

    if (!locales) return null
    const localeKeys = Object.keys(locales)

    if (localeKeys.length <= 1) return null

    // handle site base
    const siteBase = inBrowser ? site.site.value.base : '/'

    const siteBaseWithoutSuffix = siteBase.endsWith('/')
      ? siteBase.slice(0, -1)
      : siteBase

    // remove site base in browser env
    const routerPath = route.path.slice(siteBaseWithoutSuffix.length)

    const currentLangBase = localeKeys.find((key) => {
      return key === '/' ? false : routerPath.startsWith(key)
    })

    const currentContentPath = currentLangBase
      ? routerPath.substring(currentLangBase.length - 1)
      : routerPath

    const candidates = localeKeys.map((v) => {
      const localePath = v.endsWith('/') ? v.slice(0, -1) : v

      return {
        text: locales[v].label,
        link: `${localePath}${currentContentPath}`,
      }
    })

    const currentLangKey = currentLangBase || '/'

    const selectText = locales[currentLangKey].selectText
      ? locales[currentLangKey].selectText
      : 'Languages'

    return {
      text: selectText,
      items: candidates,
    }
  })
}
