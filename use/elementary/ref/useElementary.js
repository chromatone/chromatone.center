import { shallowReactive, watch, onMounted, getCurrentInstance, markRaw, onBeforeUnmount } from 'vue'
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

async function initAudio() {
  if (audio.initiating || audio.initiated) return Promise.resolve(false);
  audio.initiating = true
  audio.ctx = new (window.AudioContext || window.webkitAudioContext)()
  audio.core = audio.core || new WebRenderer()
  audio.node = await audio.core.initialize(audio.ctx, {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  })

  audio.node.connect(audio.ctx.destination)

  audio.core.on('meter', handleMeter)
  audio.core.on('scope', handleScope)
  audio.core.on('fft', handleFFT)

  audio.initiated = true
  audio.initiating = false
  return Promise.resolve(true)
}

function handleMeter(e) {
  meters[e.source] = { max: e.max, min: e.min }
}

function handleScope(e) {
  scopes[e.source] = Array.from(e?.data[0].values())
}

function handleFFT(e) {
  FFTs[e.source] = [Array.from(e?.data.real.values()), Array.from(e?.data.imag.values())]
}

function render() {
  if (!audio.initiated) return initAudio().then(render)
  if (audio?.ctx?.state === 'suspended') audio.ctx.resume()
  if (audio.started) return

  const sampleRate = el.mul(0, el.meter({ name: 'main:sample-rate' }, el.sr()))
  const stereo = [0, sampleRate]

  Object.values(layers).forEach(layer => {
    if (layer) {
      layer.signal.forEach((signal, ch) => {
        stereo[ch] = el.tanh(el.add(stereo[ch], signal))
      })
    }
  })

  audio.core.render(
    stereo[1],
    el.fft({
      name: 'main:fft',
      size: 2048
    }, stereo[0])
  )
  audio.started = Date.now()
}

export function useElementary() {
  if (getCurrentInstance()) {
    onMounted(initAudio)
    onBeforeUnmount(() => {
      audio.core && audio.core.reset()
    })
  }

  watch(layers, render, { deep: true })

  return { audio, initAudio, render, meters, scopes, FFTs, layers }
}

export { audio, layers }