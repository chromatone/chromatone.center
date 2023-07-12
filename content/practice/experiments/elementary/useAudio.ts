import { shallowReactive } from 'vue';
import { NodeRepr_t, el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';

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
  render() {
    if (audio.ctx.state === 'suspended') { audio.ctx.resume() } else if (!audio.initiated) {
      audio.init()
    } else {
      let stereo = [0, 0]
      for (let l in audio.layers) {
        let layer = audio.layers[l]
        if (layer) {
          for (let ch in layer) {
            stereo[ch] = el.tanh(el.add(stereo[ch], layer[ch]))
          }
        }


      }

      audio.core.render(stereo[0], el.fft({ key: 'main:fft', name: 'fft', size: 2048 }, stereo[1]))
    }
  },
  async init() {
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
})

export function useAudio() {
  if (!audio.initiated) {
    audio.init()
    audio.initiated = true
  }
  return audio
}