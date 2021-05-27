<template lang="pug">
.flex.flex-col.max-w-65ch.m-auto.items-center


  .flex
    .button(@click="tempo.bpm--")
      la-minus
    .info.flex
      input.w-4rem.bg-transparent(type="number",v-model="tempo.bpm")
      .ml-2 BPM
    .button(@click="tempo.bpm++")
      la-plus
  .flex.items-center
    .info {{ tempo.hz }} Hz
    .info(
      :style="{ backgroundColor: tempo.color }"
    ) {{ tempo.note }}
  .flex.items-center
    .button(@click="tempo.playing = true")
      la-play
    .button(@click="tempo.playing = false")
      la-pause
    .button(@click="tempo.stopped = true")
      la-stop
  .flex
    .info
      input.bg-transparent.w-3rem(type="number", v-model="tempo.metre.over")
    .info /
    .info {{ tempo.metre.under }}
  .flex.flex-col.items-stretch
    .p-4.m-2.border-1.rounded.transition-all.duration-60(
      :style="{ backgroundColor: tempo.blink ? 'currentColor' : 'transparent' }"
    )
    .flex.flex-wrap
      .info(
        :class="{ active: step == over.current.value }",
        v-for="step in over.steps", 
        :key="step"
        ) {{ step }}
</template>

<script setup>
import { tempo } from '@use/tempo.js'
import { Transport, PluckSynth, Sequence, Draw } from "tone";
import { reactive, ref, watchEffect } from "vue";
import { mute } from '@use/synth.js'
const synth = new PluckSynth({
  volume: -4,
}).toDestination();
const over = createRow('over')

function createRow() {
  const current = ref(0);
  const steps = reactive([1, 2, 3, 4]);
  let sequence = new Sequence(
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
  return {
    current,
    steps
  };
}


</script>

<style scoped>
.button {
  @apply p-4 border-1 m-1 cursor-pointer shadow rounded text-2xl;
}

.info {
  @apply p-4 rounded m-1 border-1 text-2xl;
}

.active {
  @apply bg-current transition-all duration-400;
}
</style>