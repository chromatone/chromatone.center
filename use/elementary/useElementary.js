import { shallowReactive, watch, reactive, onMounted, getCurrentInstance } from 'vue'
import { el } from '@elemaudio/core'
import WebRenderer from '@elemaudio/web-renderer'

const layers = reactive({})

export const audio = shallowReactive({
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
      initAudio().then(() => {
        if (audio.initiated) return

        watch(() => audio.layers, render)

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
      })
    })

  }


  return { audio, initAudio, render, layers, meters, scopes, FFTs }
}

function render(place) {
  if (audio?.ctx?.state === 'suspended') { audio?.ctx?.resume() } if (!audio.initiated) { initAudio() } else {

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

    audio.core.render(
      stereo[1],
      el.fft({
        name: 'main:fft',
        size: 2048
      }, stereo[0]))
    audio.started = audio.started || Date.now()
  }
}

export async function initAudio() {
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