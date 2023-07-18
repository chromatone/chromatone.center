import { shallowReactive, watch } from 'vue';
import { NodeRepr_t, el } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { reactive } from 'vue';
import { onMounted } from 'vue';

export type AudioLayer = {
  volume: number
  audio: NodeRepr_t | number[]
  mute?: boolean
}

const audio = shallowReactive({
  initiated: false,
  ctx: null,
  core: null,
  node: null,
})

const meters: Record<string, number[]> = reactive({})

const scopes: Record<string, number[]> = reactive({})

const FFTs: Record<string, number[][]> = reactive({})

const layers: Record<string, any> = reactive({})

export function useElemAudio() {
  if (!audio.initiated) {
    init().then(() => {
      audio.core.on('meter', e => {
        meters[e.source] = [e.max, e.min]
      })

      audio.core.on('scope', e => {
        scopes[e.source] = [...e?.data[0].values()]
      })

      audio.core.on('fft', e => {
        FFTs[e.source] = [[...e?.data.real.values()], [...e?.data.imag.values()]]
      })
    })
  }

  return {
    audio, meters, layers, init, render, silence,
  }
}

const silence = el.const({ key: 'main:silence', value: 0 })

let signal: (NodeRepr_t | number)[] = [silence, silence]

function render() {
  if (audio?.ctx?.state === 'suspended') { audio?.ctx?.resume() }
  for (let name in layers) {
    let layer = layers[name];
    signal = signal.map((ch, i) =>
      el.add(
        ch,
        el.mul(
          el.sm(
            el.const({
              key: `${name}:volume`,
              value: layer?.muted ? 0 : layer?.volume || 0
            })),
          layer.signal[i]))
    )
  }
  console.log('rendering');
  signal = signal.map(c => el.tanh(c))
  audio.core.render(...signal)
}

async function init() {
  console.log('initiated')
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