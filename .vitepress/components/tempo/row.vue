<template lang="pug">
.flex.flex-col.items-center
  .flex.flex-wrap
    .info(
      :class="{ active: step == current }",
      v-for="step in steps", 
      :key="step"
      ) 
  svg.max-h-3xl.w-full.p-4(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    )
    g(
      v-for="(coord,n) in stepCoords",
      :key="coord.x"
    )
      circle.transition-fill.duration-100(
        :cx="coord.x"
        :cy="coord.y"
        :r="100"
        :fill="n + 1 == current ? 'currentColor' : 'transparent'"
        :stroke="n + 1 !== current ? 'currentColor' : 'transparent'"
      )
      text(
        style="user-select:none;transition:all 200ms ease"
        :fill="n + 1 !== current ? 'currentColor' : 'var(--c-bg)'"
        font-family="Commissioner, sans-serif"
        font-size="42px"
        text-anchor="middle",
        dominant-baseline="middle"
        :x="coord.x",
        :y="coord.y + 0.5",
      ) {{ n + 1 }}
    g(
      v-for="(line,i) in lineCoords"
      :key="line[0].x"
    )
      line(
        style="mix-blend-mode:difference;"
        :x1="line[0].x"
        :y1="line[0].y"
        stroke-width="2"
        stroke="currentColor"
        stroke-linecap="cound"
        :x2="line[1].x"
        :y2="line[1].y"
      )
    line(
      style="mix-blend-mode:difference;"
      :x1="500"
      :y1="500"
      stroke-width="4"
      stroke="currentColor"
      stroke-linecap="cound"
      :x2="progress.x"
      :y2="progress.y"
    )
    circle(
      :cx="500"
      :cy="500"
      fill="currentColor"
      :r="5"
    )
</template>

<script setup>
import { tempo } from '@use/tempo.js'
import { Transport, PluckSynth, Sequence, Draw } from "tone";
import { reactive, ref, watchEffect, computed } from "vue";
import { mute } from '@use/synth.js'
import { getCircleCoord } from 'chromatone-theory'


const synth = new PluckSynth({
  volume: -4,
}).toDestination();

const current = ref(0);
const steps = reactive([1, 2, 3, 4]);

const stepCoords = computed(() => {
  return steps.map(step => {
    return getCircleCoord(step - 0.5, steps.length, 400, 1000)
  })
})

const lineCoords = computed(() => {
  return steps.map(step => {
    return [
      getCircleCoord(step, steps.length, 450, 1000),
      getCircleCoord(step, steps.length, 350, 1000)
    ]
  })
})

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

const progress = computed(() => {
  if (tempo.ticks) {
    return getCircleCoord(sequence.progress * 360, 360, 400, 1000)
  } else {
    return { x: 500, y: 100 }
  }
})



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
  @apply p-2 rounded-full m-1 border-1 text-2xl;
}

.active {
  @apply bg-current transition-all duration-400;
}
</style>