import { computed } from 'vue';
import { el } from '@elemaudio/core';
import { useParams } from './useParams';
import { hatSynth } from './useDrums';
import { useElementary } from './useElementary';

const params = {
  'time:bpm': { value: 120, min: 30, max: 250, step: 1, smooth: 0.1 },
  'time:steps': { value: 4, min: 1, max: 16, step: 1 },
  'time:click': { value: 0, min: 0, max: 1, step: 1, nostore: true, },
  'time:volume': { value: 0, min: 0, max: 1, step: 0.001 },
  'time:playing': { value: 0, min: 0, max: 1, step: 1, nostore: true, },
  'time:started': { value: 0, min: 0, max: 1, step: 1, nostore: true, },
  'time:paused': { value: 0, min: 0, max: 1, step: 1, nostore: true, },
}

export function useTime() {
  const { controls, groups, cv } = useParams(params, 'time')
  const { audio, meters, render, layers } = useElementary()

  const time = computed(() => Object.fromEntries(Object.entries(meters).filter(v => v[0].startsWith('time:')).map(v => [v[0].slice(5), v[1].max]).sort((a, b) => a[0] < b[0] ? 0 : 1)))

  async function init() {
    const meter = (name, node) => el.meter({ name: `time:${name}` }, node)

    let timer = meter('time', el.time())
    let sampleRate = meter('sample-rate', el.sr())

    let seconds = meter('seconds', el.div(timer, sampleRate))
    let minutes = meter('minutes', el.div(seconds, 60))
    let hours = meter('hours', el.div(minutes, 60))

    let started = meter('start', cv['time:started'])
    let paused = meter('pause', cv['time:paused'])

    let isStarted = meter('isStarted', el.ge(started, 0))
    let isPaused = meter('isPaused', el.ge(paused, 0))
    let isPlaying = meter('isPlaying', el.and(isStarted, el.sub(1, isPaused)))

    let current = meter('current', el.select(isStarted, el.select(isPaused, el.sub(paused, started), el.sub(seconds, started)), 0))

    let bpm = meter('bpm', cv['time:bpm'])
    let bps = meter('bps', el.div(bpm, 60))
    let freq = meter('frequency', el.mul(12, el.div(el.log(el.div(bps / 440)), el.log(2))))
    let pitch = meter('pitch', el.mod(freq, 12))

    let beats = meter('beats', el.mul(current, bps))
    let beat = meter('beat', el.mod(beats, 1))
    let pulse = meter('pulse', el.le(beat, 0.5))
    let steps = meter('steps', cv['time:steps'])
    let measures = meter("measures", el.div(beats, steps))
    let measure = meter("measure", el.mod(measures, 1))

    let step = meter('step', el.mod(beats, steps))
    let stepNum = meter('step-num', el.floor(step))
    let firstStep = meter('step-first', el.le(stepNum, 1))
    let stepEven = meter('step-even', el.mod(stepNum, 2))
    let stepOdd = meter('step-odd', el.eq(stepEven, 0))

    let hat = hatSynth(pitch, el.add(1000, el.mul(1500, stepEven)), 0.001, el.add(0.01, el.mul(0.06, firstStep)), el.mul(cv['time:click'], pulse))
    let metronome = el.mul(cv['time:volume'], hat)

    let silent = el.mul(0, el.add(measure, pitch, stepOdd, pulse, current, isPlaying, minutes, hours))

    let signal = [metronome, el.add(metronome, silent)]

    layers.time = { signal, volume: 1 }
    render()
  }

  function play() {
    if (controls['time:started'] === 0) {
      controls['time:started'] = time.value.seconds
    } else if (controls['time:paused'] !== 0) {
      controls['time:started'] += time.value.seconds - controls['time:paused'];
      controls['time:paused'] = 0;
    }
  }

  function pause() {
    if (controls['time:started'] !== 0 && controls['time:paused'] === 0) {
      controls['time:paused'] = time.value.seconds;
    }
  }

  function stop() {
    if (controls['time:started'] !== 0) {
      controls['time:started'] = 0;
      controls['time:paused'] = 0;
    }
  }

  return { controls, groups, params, time, play, pause, stop, init }
}