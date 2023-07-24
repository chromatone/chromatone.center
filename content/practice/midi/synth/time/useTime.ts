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
import { freqPitch } from '#/use';

const params = {
  //Kick
  'time:bpm': { value: 120, min: 30, max: 250, step: .5 },
  'time:steps': { value: 4, min: 1, max: 16, step: 1 },
}

const { controls, groups, cv } = useUI(params, 'time')

const { audio, meters, render } = useAudio()

const time = computed(() => Object.fromEntries(Object.entries(meters).filter(v => v[0].startsWith('time:')).map(v => [v[0].slice(5), v[1].max])))

export function useTime() {
  return { controls, groups, params, time }
}

const timer = el.meter({ name: 'time:time', }, el.time())

const seconds = el.meter({ name: 'time:seconds', }, el.div(timer, el.sr()))

watch(controls, () => {
  const bpm = el.meter({ name: 'time:bpm' }, cv['time:bpm'])

  const bps = el.meter({ name: 'time:bps' }, el.div(bpm, 60))

  const beats = el.meter({ name: 'time:beats' }, el.mul(seconds, bps))

  const steps = el.meter({ name: 'time:steps' }, cv['time:steps'])

  const measures = el.meter({ name: "time:measures" }, el.div(beats, steps))

  const measure = el.meter({ name: "time:measure" }, el.mod(measures, 1))

  const beat = el.meter({ name: 'time:beat' }, el.mod(beats, 1))

  const pitch = el.meter({ name: 'time:pitch' }, el.const({ key: 'time:pitch', value: freqPitch(controls['time:bpm'] / 60) }))

  const signal = el.mul(0, el.add(measure, beat, pitch))

  audio.layers.time = { signal: [0, signal], volume: 0 }

  render('time')

}, { immediate: true })