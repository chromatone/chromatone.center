import { watch, reactive } from 'vue';
import { el } from '@elemaudio/core';
import { useElementary } from './useElementary.js';
import { useParams } from './useParams.js';

// onMounted(() => synthEnabled.value = false)
// onBeforeUnmount(() => synthEnabled.value = true)

const params = {
  "string:volume": { "value": 0.4, "min": 0, "max": 1, "step": 0.01, nostore: true },
  "string:smooth": { "value": 0, "min": 0.0001, "max": .1, "step": 0.001, fixed: 3, nostore: true },
  "string:feedback": { "value": 0.995, "min": 0.9, "max": .9999, "step": 0.001, fixed: 3, nostore: true },
}

const midiParams = {
  "string:trigger": { "value": 0, "min": 0, "max": 1, "step": 1, nostore: true },
  "string:midi": { "value": 42, "min": 1, "max": 127, "step": 1, nostore: true },
  "string:velocity": { "value": 0, "min": 1, "max": 1, "step": 1, nostore: true },
}

export function useString(name = 'string' + Math.floor(Math.random() * 300)) {
  const { audio, layers, render } = useElementary()
  const { controls, cv } = useParams(params, 'string')
  const { controls: midiControls, cv: midiCV } = useParams(midiParams, `${name}-midi`)


  const note = reactive({
    number: 69,
    velocity: 0,
  })

  watch(note, n => {
    midiControls['string:trigger'] = n.velocity > 0 ? 1 : 0
    midiControls['string:midi'] = n?.number;
    midiControls['string:velocity'] = n?.velocity
  })

  // watch(() => audio.initiated, init)

  function init() {
    if (!audio.initiated) return

    let freq = el.mul(440, el.pow(2, el.div(el.sub(midiCV['string:midi'], 69), 12)))

    let delTime = el.mul(el.div(1, freq), 1000)

    let adsr = el.adsr(0.0001, .2, 0.01, .2, midiCV['string:trigger'])
    let synth = el.mul(adsr, el.noise(), midiCV['string:velocity'])
    let filtered = el.lowpass(880, 6, synth)
    let adsrOsc = el.adsr(0.005, 0.2, 0, 0.1, 1)

    let osc = el.mul(adsrOsc, el.cycle(el.mul(1, freq)), .8)

    let dl = el.delay(
      { size: 44100 },
      el.smooth(
        el.tau2pole(cv['string:smooth']),
        el.ms2samps(delTime)),
      cv['string:feedback'],
      filtered)

    let signal = el.tanh(el.add(dl, osc))

    const string = el.mul(cv['string:volume'], signal)

    layers[name] = {
      volume: 1,
      signal: [string, string]
    }

  }

  return { audio, controls, params, note, render, init }
}
