import { shallowReactive, watch, reactive, onMounted, getCurrentInstance, markRaw } from 'vue'
import { el } from '@elemaudio/core'
import WebRenderer from '@elemaudio/web-renderer'

const audio = shallowReactive({
  initiating: false,
  initiated: false,
  started: false,
  running: false,
  ctx: null,
  core: null,
  node: null,
  layers: {},
})

const meters = reactive({})

const scopes = reactive({})

const FFTs = reactive({})

export function useElementary() {
  if (getCurrentInstance()) {
    onMounted(() => {
      initAudio()
    })
  }

  watch(() => audio.layers, () => {
    if (audio.initiated) render()
  })

  return { audio, initAudio, render, meters, scopes, FFTs }
}


function render() {

  if (!audio.initiated) { initAudio() }

  if (audio?.ctx?.state === 'suspended') { audio?.ctx?.resume() }

  if (audio.started) return

  console.log('renders')

  const sampleRate = el.mul(0, el.meter({ name: 'main:sample-rate' }, el.sr()))

  let stereo = [0, sampleRate]

  for (let l in audio.layers) {
    let layer = audio.layers[l]
    if (layer) {
      for (let ch in layer.signal) {
        let signal = el.mul(
          el.sm(
            el.const({
              key: `${layer}:volume`,
              value: layer.mute ? 0 : layer?.volume || 1
            })),
          layer.signal[ch])

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

export async function initAudio() {
  if (audio.initiating || audio.initiated) return
  audio.initiating = true
  //@ts-expect-error
  audio.ctx = markRaw(new (AudioContext || webkitAudioContext)())
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