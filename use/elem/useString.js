import { watch, reactive, computed } from 'vue';
import { el } from '@elemaudio/core';
import { useElementary, midiFrequency } from './useElementary.js';
import { useParams } from './useParams.js';

const params = {
  "string:volume": { "value": 0.7, "min": 0, "max": 1, "step": 0.01, nostore: true },
  // Increased default slightly to ensure smooth pitch transitions without clicks
  "string:smooth": { "value": 0.01, "min": 0.0001, "max": 0.1, "step": 0.001, fixed: 3, nostore: true },
  // Lowered default feedback to prevent infinite high-frequency ringing
  "string:feedback": { "value": 0.95, "min": 0.9, "max": 0.999, "step": 0.001, fixed: 3, nostore: true },
}

const midiParams = {
  "string:trigger": { "value": 0, "min": 0, "max": 1, "step": 1, nostore: true },
  "string:midi": { "value": 42, "min": 1, "max": 127, "step": 1, nostore: true },
  // Fixed: velocity should be 0-1 to actually respond to dynamics
  "string:velocity": { "value": 0, "min": 0, "max": 1, "step": 0.01, nostore: true },
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
    // Ensure trigger is a clean gate (1 or 0) rather than a velocity value
    midiControls['string:trigger'] = n.velocity > 0 ? 1 : 0
    midiControls['string:midi'] = n?.number || 69
    midiControls['string:velocity'] = n?.velocity || 0
  })

  const meter = computed(() => (Math.abs(meters?.[`${name}:volume`]?.min || 0.5) + Math.abs(meters?.[`${name}:volume`]?.max || 0.5)) / 2)

  function init() {
    if (!audio.initiated) return

    // 1. Frequency calculation
    let freq = el.mul(440, el.pow(2, el.div(el.sub(midiCV['string:midi'], 69), 12)))

    // 2. Delay time in samples (period of the frequency)
    let delTimeSamps = el.ms2samps(el.mul(el.div(1, freq), 1000))

    // 3. Excitation: Gentler noise burst for a natural string character
    let adsr = el.adsr(0.02, 0.2, 0.9, 1.0, midiCV['string:trigger'])
    let noise = el.noise()
    let excitation = el.mul(adsr, noise, midiCV['string:velocity'])

    // FIXED: Q of 0.7 is much more natural than 6. Cutoff at 2x freq removes harshness.
    let filteredExcitation = el.lowpass(el.mul(freq, 6), 0.7, excitation)

    // 4. Delay line with damping
    let dlRaw = el.delay(
      { size: 44100 },
      el.smooth(el.tau2pole(cv['string:smooth']), delTimeSamps),
      cv['string:feedback'],
      filteredExcitation
    )

    // FIXED: Simulate string high-frequency energy loss by filtering the delay output.
    // Cutoff scales with frequency but has a fixed floor (800Hz) to avoid muddiness on low notes.
    let dampedDelay = el.lowpass(el.add(el.mul(freq, 3), 800), 1.7, dlRaw)

    // 5. Body Resonance (Formants)
    // FIXED: Acoustic instruments have relatively fixed body resonances. 
    // Using fixed frequencies (e.g., 150Hz, 400Hz, 800Hz) creates a realistic "wooden" body sound.
    let bodyResonance = el.mul(0.4, el.add(
      el.bandpass(220, 1.5, dampedDelay),   // First formant
      el.bandpass(440, 2.0, dampedDelay),   // Second formant
      el.bandpass(880, 2.5, dampedDelay)    // Third formant
    ))

    // 6. Subtle oscillator blend for sustained "bow" character
    let adsrOsc = el.adsr(0.05, 0.2, 0.8, 1.5, midiCV['string:trigger'])
    // FIXED: Lowered gain to 0.2 so it reinforces the fundamental without clashing or sounding synthetic
    let osc = el.mul(adsrOsc, el.cycle(freq), 0.2)

    // 7. Mix and final output
    // FIXED: Removed el.tanh. Soft clipping adds high harmonics that worsen metallic harshness.
    let signal = el.add(
      el.mul(dampedDelay, 0.5),
      el.mul(osc, 0.8),
      bodyResonance
    )

    const string = el.meter({ name: `${name}:volume` }, el.mul(cv['string:volume'], signal))

    layers[name] = {
      volume: 1,
      signal: [string, string]
    }
  }

  return { audio, controls, params, note, render, init, meter }
}