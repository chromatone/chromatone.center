import { shallowReactive, watch, onMounted, getCurrentInstance, markRaw, reactive, ref, onBeforeUnmount, computed } from 'vue'
import WebRenderer from '@elemaudio/web-renderer'
import { el } from '@elemaudio/core';
import { freqColor } from "#/use/calculations"

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

export const meters = reactive({})
export const scopes = reactive({})
export const FFTs = reactive({})


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

  audio.core.on('meter', (e) => meters[e.source] = { max: e.max, min: e.min })
  audio.core.on('scope', (e) => scopes[e.source] = Array.from(e?.data[0].values()))
  audio.core.on('fft', (e) => FFTs[e.source] = [Array.from(e?.data.real.values()), Array.from(e?.data.imag.values())])
  audio.core.on('error', err => console.log(err))

  audio.initiated = true
  audio.initiating = false
  return Promise.resolve(true)
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

export function useFFT(name = 'main:fft') {

  const { meters, FFTs } = useElementary()
  const FFT = reactive({
    sr: computed(() => meters['main:sample-rate']?.max || 44100),
    data: computed(() => FFTs?.[name] || [[], []]),
    freq: computed(() => FFT.data[0].map((val, v) => v * FFT.sr / (FFT.data[0].length || 1))),
    colors: computed(() => FFT.freq.map(f => freqColor(f))),
    total: computed(() => FFT.data[0].map((val, v) => Math.log2(1 + Math.abs(val) + Math.abs(FFT.data[1][v])))),
  })

  return FFT
}



export function midiFrequency(x) {
  return el.mul(
    440,
    el.pow(
      2,
      el.smooth(
        el.tau2pole(0.001),
        el.div(
          el.sub(x, 69),
          12
        )
      )
    )
  )
}