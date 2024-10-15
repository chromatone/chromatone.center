import { watch, reactive, computed } from 'vue';
import { el } from '@elemaudio/core';
import { useElementary } from './useElementary.js';
import { useParams } from './useParams.js';
import { midiFrequency } from './nodes.js';


const params = {
  "string:volume": { "value": 0.7, "min": 0, "max": 1, "step": 0.01, nostore: true },
  "string:smooth": { "value": 0, "min": 0.0001, "max": .1, "step": 0.001, fixed: 3, nostore: true },
  "string:feedback": { "value": 0.990, "min": 0.9, "max": .9999, "step": 0.001, fixed: 3, nostore: true },
}

const midiParams = {
  "string:trigger": { "value": 0, "min": 0, "max": 1, "step": 1, nostore: true },
  "string:midi": { "value": 42, "min": 1, "max": 127, "step": 1, nostore: true },
  "string:velocity": { "value": 0, "min": 1, "max": 1, "step": 1, nostore: true },
}

export function useString(name = 'string' + Math.floor(Math.random() * 300)) {
  const { audio, layers, render, meters } = useElementary()
  const { controls, cv } = useParams(params, 'string')
  const { controls: midiControls, cv: midiCV } = useParams(midiParams, `${name}-midi`)


  const note = reactive({
    number: 69,
    velocity: 0,
  })

  watch(note, n => {
    midiControls['string:trigger'] = n.velocity
    midiControls['string:midi'] = n?.number;
    midiControls['string:velocity'] = n?.velocity
  })

  const meter = computed(() => (Math.abs(meters?.[`${name}:volume`]?.min || 0.5) + Math.abs(meters?.[`${name}:volume`]?.max || 0.5)) / 2)

  // watch(() => audio.initiated, init)

  function init() {
    if (!audio.initiated) return

    let freq = el.mul(440, el.pow(2, el.div(el.sub(midiCV['string:midi'], 69), 12)))

    let delTime = el.mul(el.div(1, freq), 1000)

    let adsr = el.adsr(0.02, .7, 0.1, .9, midiCV['string:trigger'])
    let synth = el.mul(adsr, el.noise(), midiCV['string:velocity'])
    let filtered = el.lowpass(el.mul(4, midiFrequency(midiCV['string:midi'])), 6, synth)

    let dl = el.delay(
      { size: 44100 },
      el.smooth(el.tau2pole(cv['string:smooth']), el.ms2samps(delTime)),
      cv['string:feedback'],
      filtered
    )

    let bodyResonance = el.mul(0.3, el.add(
      el.bandpass(el.mul(freq, 1), 1, dl),  // First formant
      el.bandpass(el.mul(freq, 1.5), 2, dl),  // Second formant
      el.bandpass(el.mul(freq, 3), 3, dl)   // Third formant
    ))

    let adsrOsc = el.adsr(0.05, 0.2, 1, 1.2, midiCV['string:trigger'])
    let osc = el.mul(adsrOsc, el.cycle(el.mul(1, freq)), .8)

    let signal = el.tanh(el.add(el.mul(dl, 0.4), osc, bodyResonance))

    const string = el.meter({ name: `${name}:volume` }, el.mul(cv['string:volume'], signal))

    layers[name] = {
      volume: 1,
      signal: [string, string]
    }

  }

  return { audio, controls, params, note, render, init, meter }
}
