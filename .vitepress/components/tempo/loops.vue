<template lang="pug">
.flex.flex-col.items-center
  .flex.flex-wrap.p-8.max-w-65ch.absolute
    .info(
      :class="{ active: step == current, measure: (step - 1) % tempo.metre.under == 0 }",
      v-for="step in steps", 
      :key="step"
      ) 
  svg.max-h-3xl.w-full.p-4.mt-8(
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
      :x2="lineProgress.x"
      :y2="lineProgress.y"
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
import { PluckSynth } from "tone";
import { computed } from "vue";
import { mute } from '@use/synth.js'
import { getCircleCoord } from 'chromatone-theory'
import { useSequence } from './sequencer.js'

const synth = new PluckSynth({
  volume: -4,
}).toDestination();

const { progress, current, steps } = useSequence(
  beatClick
)

function beatClick(step, time) {
  if (mute.value) return
  if (step == 1) {
    synth.resonance = 0.95
    synth.triggerAttackRelease(tempo.tune, '16n', time)
  } else {
    synth.resonance = 0.85
    synth.triggerAttackRelease('G4', '16n', time)
  }

}

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

const lineProgress = computed(() => {
  if (progress.value > 0) {
    return getCircleCoord(progress.value * 360, 360, 400, 1000)
  } else {
    return { x: 500, y: 100 }
  }
});

</script>

<style scoped>
.info {
  @apply p-2 rounded-full m-1 border-1 border-current text-2xl;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-400;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>