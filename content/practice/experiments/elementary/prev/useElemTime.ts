import { reactive, computed } from 'vue';
import { useElemAudio }
  from './useElemAudio';
import { el } from '@elemaudio/core';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import { tempoToMs } from './utils'
import { watchEffect } from 'vue'
import { generateUI } from './shared';
import { watch } from 'vue';

const params = [
  //Kick
  { name: 'tempo:bpm', value: 120, min: 30, max: 1000, step: .5 },
]



export function useTempo() {

  const { controls, groups, cv } = generateUI(params, 'time')

  const { meters, layers, silence } = useElemAudio()

  const tempo = reactive({
    steps: 1,
    interval: computed(() => tempoToMs(controls['tempo:bpm'], tempo.steps)),

    timer: computed(() => meters?.['main:time']?.max),
    sec: computed(() => meters?.['main:sec']?.max),
  })

  const time = el.meter({ name: 'main:time', }, el.time())

  const sec = el.meter({ name: 'main:sec', }, el.div(time, el.sr()))

  watch(() => controls['tempo:bpm'], () => {
    const bpm = el.meter({ name: 'main:bpm' }, cv['tempo:bpm'])
    const signal = el.add(sec, bpm, time)

    layers.time = { mute: true, signal: [silence, signal], volume: 0 }
  }, { immediate: true })

  return { tempo, controls, groups }
}