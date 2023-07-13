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

const silence = el.const({ key: 'main:silence', value: 0 })

const time = el.mul(
  silence,
  el.meter({ name: 'main:time', key: 'main:time' }, el.time()))

let l: NodeRepr_t | number = silence
let r: NodeRepr_t | number = silence

let signal: (NodeRepr_t | number)[] = [silence, silence]

const layers: Record<string, any> = reactive({
  time: { mute: true, signal: [silence, time] }
})

export function useElemAudio() {

  onMounted(async () => {
    console.log('mounted')
    if (!audio.initiated) {
      await init()
      audio.core.on('meter', e => {
        meters[e.source] = { max: e.max, min: e.min }
      })
    }
  })

  return {
    audio, meters, layers, init, start, render
  }
}

function render() {
  start()
  for (let name in layers) {
    let layer = layers[name];
    signal = signal.map((ch, i) => el.mul(
      el.const({ key: `${name}:volume`, value: layer?.volume || 0 }),
      el.add(ch, layer.signal[i]))
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
  //@ts-expect-error
  audio.ctx = new (AudioContext || webkitAudioContext)()
  audio.core = new WebRenderer()
  audio.node = await audio.core.initialize(audio.ctx, {
    numberOfInputs: 1,
    numberOfOutputs: 1,
    outputChannelCount: [2],
  })
  audio.node.connect(audio.ctx.destination)
  audio.initiated = true
  console.log('initiated')
}