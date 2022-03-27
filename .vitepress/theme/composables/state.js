import { useDark } from '@vueuse/core'
import { getDestination, gainToDb } from 'tone'

export const isDark = useDark()

export const audio = reactive({
  mute: useStorage('mute', false),
  volume: useClamp(useStorage('main-vol', 1), 0, 1),
})


watchEffect(() => {
  getDestination().mute = audio.mute
})

watchEffect(() => {
  getDestination().volume.targetRampTo(gainToDb(audio.volume), 0.1)
})