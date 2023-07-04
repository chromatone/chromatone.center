import { shallowReactive } from 'vue';
import { NodeRepr_t, el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';

export const audio = shallowReactive({
  initiated: false,
  ctx: null,
  core: null,
  node: null,
  render(...channels) {
    console.log('rendering graph')
    if (audio.ctx.state === 'suspended') { audio.ctx.resume() }
    audio.core.render(...channels)
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