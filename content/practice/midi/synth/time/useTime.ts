import { reactive, computed } from 'vue';
import { useAudio }
  from '../audio/useAudio';
import { el } from '@elemaudio/core';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import { tempoToMs } from '../tools/utils'
import { watchEffect } from 'vue'
import { useUI } from '../tools/useUI';
import { watch } from 'vue';

const params = {
  //Kick
  'time:bpm': { value: 120, min: 30, max: 250, step: .5 },
  'time:steps': { value: 4, min: 1, max: 16, step: 1 },
}

export function useTime() {

  const { controls, groups, cv } = useUI(params, 'time')

  const { audio, render } = useAudio()


  const time = el.meter({ name: 'time:time', }, el.time())

  const sec = el.meter({ name: 'time:sec', }, el.div(time, el.sr()))

  watch(controls, () => {
    const bpm = el.meter({ name: 'time:bpm' }, cv['time:bpm'])

    const bps = el.meter({ name: 'time:bps' }, el.div(bpm, 60))

    const beats = el.meter({ name: 'time:beats' }, el.mod(el.mul(sec, bps), cv['time:steps']))

    const steps = el.meter({ name: 'time:steps' }, cv['time:steps'])

    const measures = el.meter({ name: "time:measures" }, el.div(beats, steps))

    const progress = el.meter({ name: "time:progress" }, el.mod(measures, 1))

    const signal = el.add(sec, progress, time)

    audio.layers.time = { signal: [0, signal], volume: 0 }

    render('time')

  })

  return { controls, groups, params }
}