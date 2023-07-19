import { reactive, computed } from 'vue';
import { useElemAudio }
  from './useElemAudio';
import { el } from '@elemaudio/core';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import { tempoToMs } from './utils'
import { watchEffect } from 'vue'
import { useUI } from './useUI';
import { watch } from 'vue';

const params = [
  //Kick
  { name: 'tempo:bpm', value: 120, min: 30, max: 250, step: .5 },
  { name: 'tempo:steps', value: 4, min: 1, max: 16, step: 1 },
]

export function useTempo() {

  const { controls, groups, cv } = useUI(params, 'time')

  const { meters, layers } = useElemAudio()

  const tempo = reactive({
    timer: computed(() => meters?.['tempo:time']?.max),
    sec: computed(() => meters?.['tempo:sec']?.max),
  })

  const time = el.meter({ name: 'tempo:time', }, el.time())

  const sec = el.meter({ name: 'tempo:sec', }, el.div(time, el.sr()))

  watch(controls, () => {
    const bpm = el.meter({ name: 'tempo:bpm' }, cv['tempo:bpm'])

    const bps = el.meter({ name: 'tempo:bps' }, el.div(bpm, 60))

    const beats = el.meter({ name: 'tempo:beats' }, el.mod(el.mul(sec, bps), cv['tempo:steps']))

    const steps = el.meter({ name: 'tempo:steps' }, cv['tempo:steps'])

    const measures = el.meter({ name: "tempo:measures" }, el.div(beats, steps))

    const progress = el.meter({ name: "tempo:progress" }, el.mod(measures, 1))

    const signal = el.add(sec, progress, time)

    layers.time = { mute: true, signal: [0, signal], volume: 0 }
  }, { immediate: true })

  return { tempo, controls, groups, params }
}