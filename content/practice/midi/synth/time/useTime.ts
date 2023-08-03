import { reactive, computed } from 'vue';
import { useAudio }
  from '../audio/useAudio';
import { el } from '@elemaudio/core';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import { tempoToMs } from '../tools/utils'
import { watchEffect } from 'vue'
import { Param, useUI } from '../tools/useUI';
import { watch } from 'vue';
import { freqPitch } from '#/use';
import { hatSynth } from '../drums/useDrums';

const params: { [key: string]: Param } = {
  //Kick
  'time:bpm': { value: 120, min: 30, max: 250, step: .5, smooth: 0.1 },
  'time:steps': { value: 4, min: 1, max: 16, step: 1 },
  'time:click': { value: 0, min: 0, max: 1, step: 1 },
  'time:volume': { value: 0, min: 0, max: 1, step: 0.001 },
  'time:playing': { value: 0, nostore: true, hidden: true },
}

const { controls, groups, cv } = useUI(params, 'time')

const { audio, meters, render } = useAudio()

const time = computed(() => Object.fromEntries(Object.entries(meters).filter(v => v[0].startsWith('time:')).map(v => [v[0].slice(5), v[1].max])))

const transport = reactive({
  click: 0,
  started: 0,
  paused: 0,
  isPlaying: computed(() => {
    if (transport.started === 0) {
      return false;
    } else if (transport.paused === 0) {
      return time.value.seconds > transport.started;
    } else {
      return time.value.seconds > transport.started && time.value.seconds <= transport.paused;
    }
  }),
  current: computed(() => {
    if (transport.started === 0) {
      return 0
    } else if (transport.paused === 0) {
      return time.value.seconds - transport.started
    } else {
      return transport.paused - transport.started
    }
  }),
  play() {
    console.log('play')
    if (transport.started === 0) {
      transport.started = time.value.seconds
    } else if (transport.paused !== 0) {
      // Resume playback from pause
      transport.started += time.value.seconds - transport.paused;
      transport.paused = 0;
    }
  },
  pause() {
    console.log('pause')
    if (transport.started !== 0 && transport.paused === 0) {
      transport.paused = time.value.seconds;
    }
  },
  stop() {
    console.log('stop')
    if (transport.started !== 0) {
      transport.started = 0;
      transport.paused = 0;
    }
  }
})

export function useTime() {
  return { controls, groups, params, time, transport }
}

watch([controls, () => transport.isPlaying], () => {
  let pitch = el.meter({ name: 'time:pitch' }, el.mod(el.const({ key: 'time:pitch', value: freqPitch(controls['time:bpm'] / 60) }), 12))
  let timer = el.meter({ name: 'time:time', }, el.time())
  let sampleRate = el.meter({ name: 'time:sample-rate', }, el.sr())
  let seconds = el.meter({ name: 'time:seconds', }, el.div(timer, sampleRate))

  let started = el.meter({ name: 'time:start' }, el.const({ key: 'time:start', value: transport.started }))
  let paused = el.meter({ name: 'time:pause' }, el.const({ key: 'time:pause', value: transport.paused }))
  let isStarted = el.meter({ name: 'time:isStarted' }, el.ge(started, 0))
  let isPaused = el.meter({ name: 'time:isPaused' }, el.ge(paused, 0))
  let current = el.meter({ name: 'time:current' }, el.select(isStarted, el.select(isPaused, el.sub(paused, started), el.sub(seconds, started)), 0))

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
  let hat = hatSynth(pitch, el.add(1000, el.mul(1500, stepOdd)), 0.001, el.add(0.01, el.mul(0.06, firstStep)), el.mul(controls['time:click'], pulse))
  let metronome = el.mul(cv['time:volume'], hat)
  let silent = el.mul(0, el.add(measure, pitch, stepEven, pulse, current))

  audio.layers.time = { signal: [metronome, el.add(metronome, silent)], volume: 1 }
  render('time')
}, { immediate: true })