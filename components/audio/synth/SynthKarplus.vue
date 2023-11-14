<script setup>
import { el } from '@elemaudio/core';

let midi = 42
let train = el.train(1)
let freq = el.mul(440, el.pow(2, el.div(el.sub(midi, 69), 12)))
let delTime = el.mul(el.div(1, freq), 1000)
let lfo1 = el.cycle(1 / 8)
let adsr = el.adsr(0.0001, .2, 0.01, .2, train)
let synth = el.mul(adsr, el.noise())
let filtered = el.lowpass(880, 6, synth)
let adsrOsc = el.adsr(
  0.005,
  el.add(.3, el.mul(.05, el.add(1, lfo1))),
  0, 0.1, train)
let osc = el.mul(adsrOsc, el.cycle(el.mul(1, freq)), .2)
let dl = el.delay(
  { size: 44100 },
  el.ms2samps(delTime),
  el.add(0.955, el.mul(0.02, lfo1)),
  filtered)
let both = el.add(dl, osc)
let signal = el.tanh(both)

</script>

<template lang='pug'>
.flex.flex-col.gap-4 
  .text-2xl ALGO
  pre.
    import { el } from '@elemaudio/core';

    let midi = 42
    let train = el.train(1)
    let freq = el.mul(440, el.pow(2, el.div(el.sub(midi, 69), 12)))
    let delTime = el.mul(el.div(1, freq), 1000)
    let lfo1 = el.cycle(1 / 8)
    let adsr = el.adsr(0.0001, .2, 0.01, .2, train)
    let synth = el.mul(adsr, el.noise())
    let filtered = el.lowpass(880, 6, synth)
    let adsrOsc = el.adsr(
      0.005,
      el.add(.3, el.mul(.05, el.add(1, lfo1))),
      0, 0.1, train)
    let osc = el.mul(adsrOsc, el.cycle(el.mul(1, freq)), .2)
    let dl = el.delay(
      { size: 44100 },
      el.ms2samps(delTime),
      el.add(0.955, el.mul(0.02, lfo1)),
      filtered)
    let both = el.add(dl, osc)
    let signal = el.tanh(both)

</template>