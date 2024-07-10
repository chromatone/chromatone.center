import { shallowReactive, watch, reactive, onMounted, getCurrentInstance, markRaw, watchEffect, ref, computed } from 'vue'
import { el } from '@elemaudio/core';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import WebRenderer from '@elemaudio/web-renderer'

import { freqColor } from '#/use';
import { useMidi, useTempo } from '#/use';

const audio = shallowReactive({
  initiating: false,
  initiated: false,
  started: false,
  running: false,
  ctx: null,
  core: null,
  node: null,
})

const layers = shallowReactive({})
const meters = reactive({})
const scopes = reactive({})
const FFTs = reactive({})

export function useElementary() {
  if (getCurrentInstance()) {
    onMounted(() => {
      initAudio()
    })
  }

  watch(layers, () => {
    if (audio.initiated) render()
  })

  return { audio, initAudio, render, meters, scopes, FFTs }
}


function render() {
  if (!audio.initiated) { initAudio() }
  if (audio?.ctx?.state === 'suspended') { audio?.ctx?.resume() }
  if (audio.started) return

  const sampleRate = el.mul(0, el.meter({ name: 'main:sample-rate' }, el.sr()))

  let stereo = [0, sampleRate]

  for (let l in layers) {
    let layer = layers[l]
    if (layer) {
      for (let ch in layer.signal) {
        let signal = layer.signal[ch]

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



export function useFFT(name = 'main:fft') {

  const { FFTs, meters } = useElementary()

  const FFT = reactive({
    sr: computed(() => meters['main:sample-rate']?.max || 44100),
    freq: computed(() => FFT.data[0].map((val, v) => v * FFT.sr / (FFT.data[0].length || 1))),
    colors: computed(() => FFT.freq.map(freqColor)),
    data: computed(() => FFTs?.[name] || [[], []]),
    total: computed(() => FFT.data[0].map((val, v) => Math.log2(1 + Math.abs(val) + Math.abs(FFT.data[1][v])))),
  })

  return FFT
}

export function useScope(name = "synth") {

  return computed(() => scopes[name])
}

const params = {
  "osc:volume": { "value": 0.8, "min": 0, "max": 1, "step": 0.01 },
  "osc:shape": { "value": 0.2, "min": 0, "max": 1, "step": 0.01 },
  "osc:cut-off": { "value": 4, "min": 1, "max": 32, "step": 0.5 },
  "osc:cut-q": { "value": 1.1, "min": 0, "max": 5, "step": 0.01 },
  "osc:attack": { "value": 0.01, "min": 0.001, "max": 5, "step": 0.01 },
  "osc:decay": { "value": 0.01, "min": 0.001, "max": 4, "step": 0.01 },
  "osc:sustain": { "value": 0.5, "min": 0, "max": 1, "step": 0.01 },
  "osc:release": { "value": 0.1, "min": 0.001, "max": 10, "step": 0.01 },

  "noise:gain": { "value": 0.5, "min": 0, "max": 1, "step": 0.01 },
  "noise:band-q": { "value": 50, "min": 0, "max": 100, "step": 0.1 },
  "noise:attack": { "value": 0.01, "min": 0.001, "max": 5, "step": 0.01 },
  "noise:decay": { "value": 0.01, "min": 0.001, "max": 4, "step": 0.01 },
  "noise:sustain": { "value": 0.5, "min": 0, "max": 1, "step": 0.01 },
  "noise:release": { "value": 0.01, "min": 0.001, "max": 10, "step": 0.01 },

  "fx:pingPong": { "value": 0.1, "min": 0, "max": 1, "step": 0.01 },
  "fx:feedback": { "value": 0.1, "min": 0, "max": 1, "step": 0.01 },
  "fx:shift": { "value": 0.4, "min": 0, "max": 1, "step": 0.01 },

  "fx:bpm": { "value": 120, "min": 10, "max": 500, "step": 1, "hidden": true }
}

export const synthEnabled = ref(true)

const started = ref(false)

const voiceParams = {}

for (let num = 0; num < 12; num++) {
  voiceParams[`v${num}:gate`] = { value: 0, min: 0, max: 1, step: 1, nostore: true }
  voiceParams[`v${num}:midi`] = { value: 0, min: 0, max: 127, step: 1, nostore: true }
  voiceParams[`v${num}:vel`] = { value: 0, min: 0, max: 127, step: 1, nostore: true }
}

const voices = reactive(Array(12).fill(true).map((_, i) => ({
  key: `v${i}`,
  gate: 0.0,
  midi: 69,
  vel: 0
})))

const next = ref(0)
const overflow = ref(0)

function cycleNote(num = 60, velocity = 0) {
  if (velocity) {
    do {
      next.value++
      if (next.value >= voices.length) {
        next.value = 0
        overflow.value++
      }
      if (overflow.value > 3) break;
    } while (voices[next.value].gate == 1)
    overflow.value = 0
    voices[next.value]['gate'] = 1;
    voices[next.value]['midi'] = num;
    voices[next.value]['vel'] = velocity;
  } else {
    voices.forEach(v => {
      if (v.midi == num) {
        v.gate = 0
      }
    })
  }
}

function stopAll(num) {
  voices.forEach(v => v.gate = 0)
}


export function useRefSynth(count = 12) {
  const { audio, render } = useElementary()

  const { controls, cv, groups } = useParams(params, 'ref')

  const { controls: voiceControls, cv: voiceCVs } = useParams(voiceParams, 'ref')

  watch(voices, vs => {
    for (let voice of vs) {
      voiceControls[`${voice.key}:gate`] = voice.gate
      voiceControls[`${voice.key}:midi`] = voice.midi
      voiceControls[`${voice.key}:vel`] = voice.vel
    }
  })



  const tempo = useTempo()
  watchEffect(() => {
    controls['fx:bpm'] = tempo.bpm
  })

  const { midi } = useMidi()

  watch(() => midi.note, n => {
    render()
    if (synthEnabled.value) {
      cycleNote(n.number, n.velocity)
    }
  })


  watchEffect(() => {
    if (audio.initiated) {

      layers.synth = {
        volume: 1,
        signal: pingPong(
          el.scope(
            { name: 'synth', size: 512 },
            poly()
          )
        )
      }

      render('synth')


    }
  })


  function poly() {

    return el.mul(
      el.sqrt(
        el.div(
          1,
          el.const({
            key: 'voice-count',
            value: voices.length
          }))),
      el.add(...voices.map(
        voice => {
          let osc = el.mul(
            cv['osc:volume'],
            el.adsr(
              cv["osc:attack"],
              cv["osc:decay"],
              cv["osc:sustain"],
              cv["osc:release"],
              voiceCVs[`${voice.key}:gate`]
            ),
            el.div(voiceCVs[`${voice.key}:vel`], 127),
            el.lowpass(
              el.mul(
                cv['osc:cut-off'],
                midiFrequency(voiceCVs[`${voice.key}:midi`])
              ),
              cv['osc:cut-q'],
              el.add(
                el.mul(
                  el.sub(
                    1,
                    cv['osc:shape']
                  ),
                  el.blepsquare(
                    midiFrequency(voiceCVs[`${voice.key}:midi`])
                  )
                ),
                el.mul(
                  cv['osc:shape'],
                  el.blepsaw(midiFrequency(voiceCVs[`${voice.key}:midi`]))
                )
              )
            )
          )

          let noise = el.mul(
            cv['noise:gain'],
            el.adsr(
              cv['noise:attack'],
              cv['noise:decay'],
              cv['noise:sustain'],
              cv['noise:release'],
              voiceCVs[`${voice.key}:gate`]),
            el.bandpass(
              midiFrequency(voiceCVs[`${voice.key}:midi`]),
              cv['noise:band-q'],
              el.noise()))

          return el.add(osc, noise)
        }
      )

      )
    )
  }


  function pingPong(x) {
    return Array(2).fill(null).map((n, i) => el.add(
      x,
      el.mul(
        cv['fx:pingPong'],
        el.delay(
          { size: 44100 },
          el.ms2samps(el.mul(
            el.div(60000, cv['fx:bpm']),
            el.add(1, el.mul(i == 0 ? -.5 : .5, cv['fx:shift']))
          )),
          cv['fx:feedback'],
          x))))
  }

  return { controls, cv, groups, audio, render, started, voices, cycleNote, stopAll, synthEnabled }
}


export function midiFrequency(x) {
  return el.mul(
    440,
    el.pow(
      2,
      el.smooth(
        el.tau2pole(0.001),
        el.div(
          el.sub(x, 69),
          12
        )
      )
    )
  )
}



export function useParams(params, title = 'ref') {

  const { audio } = useElementary()

  const controls = reactive({})
  const cv = {}
  const setters = {}
  const groups = {}


  for (let p in params) {
    let param = params[p]
    controls[p] = useClamp(param?.nostore ? param.value : useStorage(`${title}:${p}`, param.value), param.min, param.max)
    if (!param?.hidden) {
      const split = p.split(':')
      const name = split.pop()
      const group = split.pop()
      groups[group] = groups[group] || {}
      groups[group][name] = param
    }
  }

  watch(() => audio.initiated, () => {
    if (!audio.initiated) return
    for (let p in params) {
      let [node, setter] = audio.core.createRef("const", { value: controls[p] }, []);
      cv[p] = node
      setters[p] = setter
    }
  }, { immediate: true })

  watch(controls, cs => {
    for (let c in cs) {
      if (!setters[c] || !audio.initiated) continue
      setters[c]({ value: cs[c] })
    }
  })

  return { controls, cv, setters, groups }
}