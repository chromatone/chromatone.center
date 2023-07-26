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
import { hatSynth } from '../drums/useDrums';

const params = {
  //Kick
  'time:bpm': { value: 120, min: 30, max: 250, step: .5, smooth: 0.1 },
  'time:steps': { value: 4, min: 1, max: 16, step: 1 },
  'time:click': { value: 0, min: 0, max: 1, step: 1 },
  'time:volume': { value: 0, min: 0, max: 1, step: 0.001 },
}

const { controls, groups, cv } = useUI(params, 'time')

const { audio, meters, render } = useAudio()

const time = computed(() => Object.fromEntries(Object.entries(meters).filter(v => v[0].startsWith('time:')).map(v => [v[0].slice(5), v[1].max])))

const metro = reactive({
  click: 0
})

export function useTime() {
  return { controls, groups, params, time, metro }
}

watch(controls, () => {

  let pitch = el.meter({ name: 'time:pitch' }, el.mod(el.const({ key: 'time:pitch', value: freqPitch(controls['time:bpm'] / 60) }), 12))

  let timer = el.meter({ name: 'time:time', }, el.time())

  let sampleRate = el.meter({ name: 'time:sample-rate', }, el.sr())

  let seconds = el.meter({ name: 'time:seconds', }, el.div(timer, sampleRate))

  let bpm = el.meter({ name: 'time:bpm' }, cv['time:bpm'])

  let bps = el.meter({ name: 'time:bps' }, el.div(bpm, 60))

  let beats = el.meter({ name: 'time:beats' }, el.mul(seconds, bps))

  let steps = el.meter({ name: 'time:steps' }, cv['time:steps'])

  let measures = el.meter({ name: "time:measures" }, el.div(beats, steps))

  let measure = el.meter({ name: "time:measure" }, el.mod(measures, 1))

  let beat = el.meter({ name: 'time:beat' }, el.mod(beats, 1))

  let pulse = el.meter({ name: 'time:pulse' }, el.le(beat, 0.5))

  let step = el.meter({ name: 'time:step' }, el.mod(beats, steps))

  let stepNum = el.meter({ name: 'time:step-num' }, el.floor(step))

  let firstStep = el.meter({ name: 'time:step-first' }, el.le(stepNum, 1))

  let stepOdd = el.meter({ name: 'time:step-odd' }, el.mod(stepNum, 2))

  let stepEven = el.meter({ name: 'time:step-even' }, el.eq(stepOdd, 0))

  let silent = el.mul(0, el.add(measure, pitch, stepEven, pulse))

  let hat = hatSynth(220, el.add(2000, el.mul(2000, stepOdd)), 0.001, el.add(0.01, el.mul(0.1, firstStep)), controls['time:click'] == 1 ? pulse : 0)

  let metronome = el.mul(cv['time:volume'], hat)

  audio.layers.time = { signal: [metronome, el.add(metronome, silent)], volume: 1 }

  render('time')

}, { immediate: true })