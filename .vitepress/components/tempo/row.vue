<template lang="pug">
.flex.flex-wrap
  .info(
    :class="{ active: step == current }",
    v-for="step in steps", 
    :key="step"
    ) {{ step }} 
</template>

<script setup>
import { tempo } from '@use/tempo.js'
import { Transport, PluckSynth, Sequence, Draw } from "tone";
import { reactive, ref, watchEffect } from "vue";
import { mute } from '@use/synth.js'
import { getCircleCoord } from 'chromatone-theory'


const synth = new PluckSynth({
  volume: -4,
}).toDestination();

const current = ref(0);
const steps = reactive([1, 2, 3, 4]);

const sequence = new Sequence(
  (time, step) => {
    Draw.schedule(() => {
      current.value = step;
    }, time);
    if (mute.value) return
    if (step == 1) {
      synth.resonance = 0.85;
      synth.triggerAttackRelease("C4", "16n", time);
    } else {
      synth.resonance = 0.8;
      synth.triggerAttackRelease(
        "G4",
        "16n",
        time
      );
    }

  },
  steps,
  "4n"
).start(0);

watchEffect(() => {
  steps.length = 0;
  for (let i = 1; i <= tempo.metre.over; i++) {
    steps.push(i);
  }
  sequence.events = steps;
});

watchEffect(() => {
  if (tempo.stopped) {
    current.value = 0;
  }
});


</script>

<style scoped>
.info {
  @apply p-4 rounded m-1 border-1 text-2xl;
}

.active {
  @apply bg-current transition-all duration-400;
}
</style>