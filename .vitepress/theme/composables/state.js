import { useStorage, useDark } from '@vueuse/core'

export const mute = useStorage('mute', false)

export const isDark = useDark()
