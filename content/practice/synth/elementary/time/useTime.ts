import { reactive, computed } from 'vue';
import { useAudio }
  from '../audio/useAudio';
import { NodeRepr_t, el } from '@elemaudio/core';
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

const time = computed(() => Object.fromEntries(Object.entries(meters).filter(v => v[0].startsWith('time:')).map(v => [v[0].slice(5), v[1].max]).sort((a, b) => a[0] < b[0] ? 0 : 1)))

const transport = reactive({
  started: 0,
  paused: 0,
  play() {
    if (transport.started === 0) {
      transport.started = time.value.seconds
    } else if (transport.paused !== 0) {
      // Resume playback from pause
      transport.started += time.value.seconds - transport.paused;
      transport.paused = 0;
    }
  },
  pause() {
    if (transport.started !== 0 && transport.paused === 0) {
      transport.paused = time.value.seconds;
    }
  },
  stop() {
    if (transport.started !== 0) {
      transport.started = 0;
      transport.paused = 0;
    }
  }
})

function meter(name: string, node: number | NodeRepr_t) {
  return el.meter({ name: `time:${name}` }, node)
}

const signal = computed(() => {
  let pitch = meter('pitch', el.mod(el.const({ key: 'time:pitch', value: freqPitch(controls['time:bpm'] / 60) }), 12))
  let timer = meter('time', el.time())
  let sampleRate = el.meter({ name: 'time:sample-rate', }, el.sr())
  let seconds = meter('seconds', el.div(timer, sampleRate))

  let started = meter('start', el.const({ key: 'time:start', value: transport.started }))
  let paused = meter('pause', el.const({ key: 'time:pause', value: transport.paused }))
  let isStarted = meter('isStarted', el.ge(started, 0))
  let isPaused = meter('isPaused', el.ge(paused, 0))
  let isPlaying = meter('isPlaying', el.and(isStarted, el.sub(1, isPaused)))
  let current = meter('current', el.select(isStarted, el.select(isPaused, el.sub(paused, started), el.sub(seconds, started)), 0))

  let bpm = meter('bpm', cv['time:bpm'])
  let bps = meter('bps', el.div(bpm, 60))
  let beats = meter('beats', el.mul(current, bps))
  let steps = meter('steps', cv['time:steps'])
  let measures = el.meter({ name: "time:measures" }, el.div(beats, steps))
  let measure = el.meter({ name: "time:measure" }, el.mod(measures, 1))
  let beat = meter('beat', el.mod(beats, 1))
  let pulse = meter('pulse', el.le(beat, 0.5))
  let step = meter('step', el.mod(beats, steps))
  let stepNum = meter('step-num', el.floor(step))
  let firstStep = meter('step-first', el.le(stepNum, 1))
  let stepOdd = meter('step-odd', el.mod(stepNum, 2))
  let stepEven = meter('step-even', el.eq(stepOdd, 0))
  let hat = hatSynth(pitch, el.add(1000, el.mul(1500, stepOdd)), 0.001, el.add(0.01, el.mul(0.06, firstStep)), el.mul(controls['time:click'], pulse))
  let metronome = el.mul(cv['time:volume'], hat)
  let silent = el.mul(0, el.add(measure, pitch, stepEven, pulse, current, isPlaying))
  return [metronome, el.add(metronome, silent)]
})

export function useTime() {
  return { controls, groups, params, time, transport }
}

watch([controls, transport], () => {

  audio.layers.time = { signal: signal.value, volume: 1 }
  render('time')
}, { immediate: true })