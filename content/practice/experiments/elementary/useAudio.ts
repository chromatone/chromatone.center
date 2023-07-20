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
  initiated: false,
  ctx: null,
  core: null,
  node: null,
  layers: {
    synth: null,
    mic: null,
    seq: null,
    drums: null,
  },


})

export function useAudio() {

  init()

  watch([audio, layers], render)
  return { audio, init, render, layers }
}

function render() {
  if (audio.ctx.state === 'suspended') { audio.ctx.resume() } else {
    let stereo = [el.mul(0, el.scope({ key: 'main:scope', name: 'main:scope', size: 256 }, el.time())), 0]
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
  if (audio.initiated) return
  audio.initiated = true
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