import { shallowReactive, watch } from 'vue';
import { NodeRepr_t, el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { reactive } from 'vue';
import { onMounted } from 'vue';

export type AudioLayer = {
  volume?: number
  signal: (number | NodeRepr_t)[]
  mute?: boolean
}

const audio = shallowReactive({
  initiating: false,
  initiated: false,
  ctx: null,
  core: null,
  node: null,
})

const meters: Record<string, { max: number, min: number }> = reactive({})

const scopes: Record<string, number[]> = reactive({})

const FFTs: Record<string, number[][]> = reactive({})

export function useElemAudio() {
  if (!audio.initiated && !audio.initiating) {
    audio.initiating = true
    init().then(() => {

      audio.core.on('meter', e => {
        meters[e.source] = { max: e.max, min: e.min }
      })

      audio.core.on('scope', e => {
        scopes[e.source] = [...e?.data[0].values()]
      })

      audio.core.on('fft', e => {
        FFTs[e.source] = [[...e?.data.real.values()], [...e?.data.imag.values()]]
      })

      audio.initiating = false
      audio.initiated = true
    })
  }

  return {
    audio, meters, layers, scopes, init, render
  }
}

const layers: Record<string, AudioLayer> = reactive({})

watch(layers, ls => {
  render(ls)
})

function render(lrs: Record<string, AudioLayer> = layers) {
  if (audio?.ctx?.state === 'suspended') { audio?.ctx?.resume() }
  if (!audio.initiated) {
    return
  }
  const silence = el.const({ key: 'main:silence', value: 0 })
  let signal: (NodeRepr_t | number)[] = [silence, silence]
  for (let name in lrs) {
    let layer = lrs[name];
    signal = signal.map((ch, i) =>
      el.add(
        ch,
        el.mul(
          el.sm(
            el.const({
              key: `${name}:volume`,
              value: layer?.mute ? 0 : layer?.volume || 1
            })),
          layer.signal[i]))
    )
  }
  signal = signal.map(c => el.tanh(c))
  audio.core.render(...signal)
}

async function init() {
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