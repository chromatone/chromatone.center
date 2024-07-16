import { shallowReactive, watch, reactive, onMounted, getCurrentInstance, markRaw } from 'vue'
import WebRenderer from '@elemaudio/web-renderer'
import { el } from '@elemaudio/core';
import { meters } from './useMeter'
import { scopes } from './useScope'
import { FFTs } from './useFFT'

const audio = shallowReactive({
  initiating: false,
  initiated: false,
  started: false,
  running: false,
  ctx: null,
  core: null,
  node: null,
})

const layers = shallowReactive({})

export function useElementary() {
  if (getCurrentInstance()) {
    onMounted(() => {
      initAudio()
    })
  }

  watch(layers, () => {
    if (audio.initiated) render()
  })

  return { audio, initAudio, render, meters, scopes, FFTs, layers }
}

async function initAudio() {
  if (audio.initiating || audio.initiated) return
  audio.initiating = true
  audio.ctx = markRaw(new (window.AudioContext || window.webkitAudioContext)())
  audio.core = markRaw(new WebRenderer())
  audio.node = markRaw(await audio.core.initialize(audio.ctx, {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  }))
  audio.node.connect(audio.ctx.destination)

  audio.core.on('meter', e => {
    meters[e.source] = { max: e.max, min: e.min }
  })

  audio.core.on('scope', e => {
    scopes[e.source] = [...e?.data[0].values()]
  })

  audio.core.on('fft', e => {
    FFTs[e.source] = [[...e?.data.real.values()], [...e?.data.imag.values()]]
  })

  audio.initiated = true
}

function render() {
  if (!audio.initiated) { initAudio() }
  if (audio?.ctx?.state === 'suspended') { audio?.ctx?.resume() }
  if (!audio.initiated || audio.started) return

  const sampleRate = el.mul(0, el.meter({ name: 'main:sample-rate' }, el.sr()))

  const stereo = [0, sampleRate]

  for (let l in layers) {
    let layer = layers[l]
    if (layer) {
      for (let ch in layer.signal) {
        let signal = layer.signal[ch]
        stereo[ch] = el.tanh(el.add(stereo[ch], signal))
      }
    }
  }

  audio?.core?.render(
    stereo[1],
    el.fft({
      name: 'main:fft',
      size: 2048
    }, stereo[0]))
  audio.started = audio.started || Date.now()
}

export { audio, layers }