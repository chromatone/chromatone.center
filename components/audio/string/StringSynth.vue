<script setup>
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';
import { el } from '@elemaudio/core';

import { useMidi, synth as AppSynth } from "#/use";

onMounted(() => AppSynth.state.midi = false)
onBeforeUnmount(() => AppSynth.state.midi = true)

import { useAudio } from '../useAudio.js';
import { useParams } from '../useParams.js';

const { midi } = useMidi()

const params = {
  "string:volume": { "value": 0.8, "min": 0, "max": 1, "step": 0.01 },
  "string:trigger": { "value": 0, "min": 0, "max": 1, "step": 1, nostore: true },
  "string:midi": { "value": 42, "min": 1, "max": 127, "step": 1, nostore: true },
  "string:velocity": { "value": 0, "min": 1, "max": 127, "step": 1, nostore: true }
}

const { audio, render } = useAudio()

const { controls, cv } = useParams(params, 'string')

watch(() => midi.note, n => {
  controls['string:trigger'] = n.velocity > 0 ? 1 : 0
  controls['string:midi'] = n?.number;
  controls['string:velocity'] = n?.velocity / 127
})

watch(() => audio.initiated, () => {

  let freq = el.mul(440, el.pow(2, el.div(el.sub(cv['string:midi'], 69), 12)))

  let delTime = el.mul(
    el.div(1, freq),
    1000
  )
  let adsr = el.adsr(0.0001, .2, 0.01, .2, cv['string:trigger'])
  let synth = el.mul(adsr, el.noise(), cv['string:velocity'])
  let filtered = el.lowpass(1880, 6, synth)
  let adsrOsc = el.adsr(
    0.005,
    0.2,
    0, 0.1, 1)

  let osc = el.mul(adsrOsc, el.cycle(el.mul(1, freq)), .2)

  let dl = el.delay(
    { size: 44100 },
    el.ms2samps(delTime),
    el.add(0.995),
    filtered)

  // let dll = el.tapOut(
  //   { name: 'x' },
  //   el.smooth(
  //     0.5,
  //     el.mul(
  //       0.99,
  //       el.add(filtered, el.delay({ size: 44100 }, el.ms2samps(delTime), 0, el.tapIn({ name: 'x' })))
  //     )
  //   )
  // );

  let both = el.add(dl, osc)
  let signal = el.tanh(both)

  const string = el.mul(cv['string:volume'], signal)

  audio.layers.string = {
    volume: 1,
    signal: [string, string]
  }
})

</script>

<template lang='pug'>
button.p-40.text-2xl.font-bold.bg-light-900.dark-bg-dark-700(v-if="!audio.started" @click="render()") START 
.flex.flex-col.gap-6.p-2(v-else)
  AudioAnalysisFFT
  MidiKeys
</template>