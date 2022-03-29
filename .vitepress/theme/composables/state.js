import { useDark } from '@vueuse/core'
import { getDestination, gainToDb } from 'tone'

export const isDark = useDark()

const audio = reactive({
  initiated: false,
  mute: useStorage('mute', false),
  volume: useClamp(useStorage('main-vol', 1), 0, 1),
})


export function useAudio() {
  if (!audio.initiated) {
    watchEffect(() => {
      getDestination().mute = audio.mute
    })

    watchEffect(() => {
      getDestination().volume.targetRampTo(gainToDb(audio.volume), 0.1)
    })
  }
  audio.initiated = true
  return audio
}