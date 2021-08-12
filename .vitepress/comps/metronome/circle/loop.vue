<template lang="pug">
g
  g(
    :opacity="loop.mute ? '0.25' : '1'"
  )
    metronome-circle-sector(
      v-for="step in steps"
      :key="step"
      :step="step"
      :total="steps.length"
      :active="!mutes[step] && step == current"
      :radius="radius"
      :opacity="mutes[step] ? 0.3 : 1"
      style="cursor:pointer"
      @click="mutes[step] = !mutes[step]"
    )
  g(
    @click="loop.mute = false"
    v-if="loop.mute"
    style="cursor:pointer"
  )
    circle(
      :r="24"
      :cx="500"
      :cy="144 + 125 * order"
      fill="var(--c-bg)"
    )
    la-volume-off(
      style="color:currentColor"
      font-size="40px"
      :x="477"
      :y="120 + 125 * order"
    )
  text(
    style="user-select:none;transition:all 300ms ease"
    fill="currentColor"
    font-family="Commissioner, sans-serif"
    font-size="40px"
    text-anchor="end",
    dominant-baseline="middle"
    :x="490",
    :y="100 + 125 * order",
    ) {{ loop.over }} 
  text(
    style="user-select:none;transition:all 300ms ease"
    fill="currentColor"
    font-family="Commissioner, sans-serif"
    font-size="40px"
    text-anchor="left",
    dominant-baseline="middle"
    :x="510",
    :y="100 + 125 * order",
    ) {{ loop.under }}

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
import { computed } from "vue";
import { getCircleCoord } from 'chromatone-theory'
import { useSequence } from '../sequence.js'

defineEmits('del')

const props = defineProps({
  radius: {
    type: Number,
    default: 400
  },
  order: {
    type: Number,
    default: 0
  },
  loop: {
    type: Object,
    default: {
      mute: false,
      over: 4,
      under: 4
    }
  }
});


const { progress, current, steps, mutes } = useSequence(props.loop, props.order)

const lineProgress = computed(() => {
  if (progress.value > 0) {
    return getCircleCoord(progress.value * 360, 360, props.radius + 50, 1000)
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