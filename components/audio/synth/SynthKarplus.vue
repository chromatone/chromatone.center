<script setup>
//https://www.elementary.audio/playground?version=3.0.0&code=JYWwDg9gTgLgBAbwKYBsC+cBmUIjgcgAFUkQBDAVwBNgIB6AY2iXwG4AodlJeEYGuAF44AFgBMXHnBhQywAHZC4qAHQy58gBQBGAJST42JAEclqkBRSaRIgAwAaVZADumsY5QqaAN02qAzhQARpp8NPYAbACcuvbaYrqJBnBUqAAqoEhmnhZWqj469kbGsdq25frc8CiYENrZKgwAngzcOnQAHJVSZFT+UA29-Zq2KuW22vZwKu5woxNTM1PqCt3w-k3yMAAWDbmaQ1AeKvIQwP5ImklVWMAoMEhQSFQNKBDOYGT+-ppwHR0OOARKYbLbbNZwQ4AeX8DEGfSgmnYcDmY1sAFYpuxVL0qJoVABmY77MaYnFUPGTGp1RKxZGA1GTFEreQQiCwvaWA4ImEMY7NVqXcxcybFRL2GYQqgoBqpFBkJpIlEIfzAABeSAAXKIRGVbGgsSjzP4xP4yOAfnKMiAkLE4MjlJ5cSMVFF0WSclz5u5qXo7Q7MHcHk8qBCghAdvC8dL7OyGBDVQBzeRkGXCVQwMjybaacM7fRIAAekFgKSQmEo90QDqe8lSiN01ZRKKeMAoUEUAG0kymUPYe6mALoOtDsNBAA


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