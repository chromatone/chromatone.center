import { shallowReactive, watch, reactive } from 'vue'
import { NodeRepr_t, el } from '@elemaudio/core'
import WebRenderer from '@elemaudio/web-renderer'

export type AudioLayer = {
  mute?: boolean
  volume?: number
  signal: (number | NodeRepr_t)[]
}

const layers: Record<string, AudioLayer> = reactive({})

export const audio = shallowReactive({
  initiating: false,
  initiated: false,
  ctx: null,
  core: null,
  node: null,
  layers: {
    synth: null,
    mic: null,
    seq: null,
    drums: null,
    time: null,
  },
})

const meters: Record<string, { max: number, min: number }> = reactive({})

const scopes: Record<string, number[]> = reactive({})

const FFTs: Record<string, number[][]> = reactive({})

export function useAudio() {

  init().then(() => {
    if (audio.initiated) return
    audio.initiated = true
    audio.core.on('meter', e => {
      meters[e.source] = { max: e.max, min: e.min }
    })

    audio.core.on('scope', e => {
      scopes[e.source] = [...e?.data[0].values()]
    })

    audio.core.on('fft', e => {
      FFTs[e.source] = [[...e?.data.real.values()], [...e?.data.imag.values()]]
    })


  })

  watch(audio, render)

  return { audio, init, render, layers, meters }
}

function render(place) {
  console.log(place)
  if (audio.ctx.state === 'suspended') { audio.ctx.resume() } else {
    let stereo = [el.mul(0, el.scope({ key: 'main:scope', name: 'main:scope', size: 256 }, el.time())), 0]
    console.log({ place, layers })
    for (let l in audio.layers) {
      let layer = audio.layers[l]
      if (layer) {

        for (let ch in layer) {

          stereo[ch] = el.tanh(el.add(stereo[ch], layer[ch]))
        }
      }
    }

    audio.core.render(
      stereo[0],
      el.fft({
        key: 'main:fft',
        name: 'fft',
        size: 2048
      }, stereo[1]))
  }
}

async function init() {
  if (audio.initiating) return
  audio.initiating = true
  //@ts-expect-error
  audio.ctx = new (AudioContext || webkitAudioContext)()
  audio.core = new WebRenderer()
  audio.node = await audio.core.initialize(audio.ctx, {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  })
  audio.node.connect(audio.ctx.destination)
}