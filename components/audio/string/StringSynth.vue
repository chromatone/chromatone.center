<script setup>
import { ref, watch, onBeforeUnmount, onMounted } from 'vue';
import { el } from '@elemaudio/core';
import { useElementary } from '#/use/elementary/useElementary.js';
import { useParams } from '#/use/elementary/useParams.js';
import { useMidi, synthEnabled } from "#/use";

onMounted(() => synthEnabled.value = false)
onBeforeUnmount(() => synthEnabled.value = true)

const { midi } = useMidi()

const params = {
  "string:volume": { "value": 0.8, "min": 0, "max": 1, "step": 0.01 },
  "string:smooth": { "value": 0.8, "min": 0.0001, "max": .1, "step": 0.001, fixed: 3 },
  "string:feedback": { "value": 0.995, "min": 0.9, "max": .9999, "step": 0.001, fixed: 3 },
}

const midiParams = {
  "string:trigger": { "value": 0, "min": 0, "max": 1, "step": 1, nostore: true },
  "string:midi": { "value": 42, "min": 1, "max": 127, "step": 1, nostore: true },
  "string:velocity": { "value": 0, "min": 1, "max": 127, "step": 1, nostore: true },
}

const { audio, render } = useElementary()

const { controls, cv } = useParams(params, 'string')

const { controls: midiControls, cv: midiCV } = useParams(midiParams, 'string-midi')

watch(() => midi.note, n => {
  midiControls['string:trigger'] = n.velocity > 0 ? 1 : 0
  midiControls['string:midi'] = n?.number;
  midiControls['string:velocity'] = n?.velocity / 127
})

watch(() => audio.initiated, () => {
  if (!audio.initiated) return

  let freq = el.mul(440, el.pow(2, el.div(el.sub(midiCV['string:midi'], 69), 12)))

  let delTime = el.mul(
    el.div(1, freq),
    1000
  )

  let adsr = el.adsr(0.0001, .2, 0.01, .2, midiCV['string:trigger'])
  let synth = el.mul(adsr, el.noise(), midiCV['string:velocity'])
  let filtered = el.lowpass(880, 6, synth)
  let adsrOsc = el.adsr(0.005, 0.2, 0, 0.1, 1)

  let osc = el.mul(adsrOsc, el.cycle(el.mul(1, freq)), .2)

  let dl = el.delay(
    { size: 44100 },
    el.smooth(
      el.tau2pole(cv['string:smooth']),
      el.ms2samps(delTime)),
    cv['string:feedback'],
    filtered)

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
  .flex.flex-wrap.p-2.gap-4
    control-rotary(
      v-for="(param, p) in params"
      :param="p.split(':')[1]" v-model="controls[p]" :min="param.min" :max="param.max" :fixed="param.fixed" :step="param.step")

  MidiKeys
</template>


// let dll = el.tapOut(
// { name: 'x' },
// el.smooth(
// 0.5,
// el.mul(
// 0.99,
// el.add(filtered, el.delay({ size: 44100 }, el.ms2samps(delTime), 0, el.tapIn({ name: 'x' })))
// )
// )
// );