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
  started: false,
  ctx: null,
  core: null,
  node: null,
})

const meters: Record<string, { min: number, max: number }> = reactive({})

const scopes: Record<string, number[]> = reactive({})

const FFTs: Record<string, number[][]> = reactive({})

const silence = el.const({ key: 'main:silence', value: 0 })

let signal: (NodeRepr_t | number)[] = [silence, silence]

const layers: Record<string, any> = reactive({})


export function useElemAudio() {
  if (!audio.initiated) {
    init()
  }

  return {
    audio, meters, layers, init, start, render, silence,
  }
}

function render() {
  start()
  for (let name in layers) {
    let layer = layers[name];
    signal = signal.map((ch, i) =>
      el.add(
        ch,
        el.mul(
          el.const({ key: `${name}:volume`, value: layer?.muted ? 0 : layer?.volume || 0 }),
          layer.signal[i]))
    )
  }
  console.log('rendering');
  signal = signal.map(c => el.tanh(c))
  audio.core.render(...signal)
}

function start() {
  if (audio?.ctx?.state === 'suspended') { audio?.ctx?.resume(); }
  audio.started = true
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



  audio.core.on('meter', e => {
    meters[e.source] = { max: e.max, min: e.min }
  })

  audio.core.on('scope', e => {
    scopes[e.source] = [...e?.data[0].values()]
  })

  audio.core.on('fft', e => {
    FFTs[e.source] = [[...e?.data.real.values()], [...e?.data.imag.values()]]
  })


}