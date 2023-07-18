import { reactive, computed } from 'vue';
import { useElemAudio }
  from './useElemAudio';
import { el } from '@elemaudio/core';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import { tempoToMs } from './utils'

export function useTempo() {

  const { meters, layers, silence } = useElemAudio()

  const tempo = reactive({
    bpm: useClamp(useStorage('elem:BPM', 120), 20, 600),
    steps: 1,
    interval: computed(() => tempoToMs(tempo.bpm, tempo.steps)),
    clock: computed(() => meters?.['main:time']?.[0]),
    phasor: computed(() => meters?.['main:phasor']?.[0].toFixed(2)),
  })

  const clock = el.meter({ name: 'main:time', }, el.time())

  const phasor = el.meter({ name: 'main:phasor', }, el.div(el.mod(clock, el.ms2samps(tempo.interval)), tempo.interval))

  layers.time = { mute: true, signal: [silence, phasor] }

  return { tempo }
}