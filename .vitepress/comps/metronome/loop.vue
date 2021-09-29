<template lang="pug">
g(
  text-anchor="middle",
  style="user-select:none;transition:all 300ms ease"
)
  g(
    :opacity="loop.mute ? '0.25' : '1'"
  )
    metronome-sector(
      v-for="step in steps"
      :key="step"
      :step="step"
      :total="steps.length"
      :active="!mutes[step] && step == current"
      :radius="radius"
      :muted="mutes[step]"
      :opacity="mutes[step] ? 0.3 : 1"
      style="cursor:pointer"
      @click="mutes[step] = !mutes[step]"
    )
  g.info(
    :transform="`translate(500,${order * 125})`"
  )
    rect(
      :fill="isDark ? '#333' : '#eee'"
      x="-60"
      :y="38"
      rx="10"
      width="120"
      height="60"
      style="mix-blend-mode:difference;"
    )
    g(
      @click="loop.mute = !loop.mute"
      style="cursor:pointer;color:currentColor"
      transform="translate(0, 125)"
      font-size="32px"
    )
      circle(
        :r="24"
        :cx="0"
        :cy="0"
        fill="var(--c-bg)"
      )
      la-volume-off(
        v-if="!loop.mute"
        style=""
        :x="-20"
        :y="-20"
      )
      la-volume-up(
        v-else
        style=""
        :x="-20"
        :y="-20"
      )
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="40px"
      text-anchor="end",
      :x="-10",
      :y="80",
      ) {{ loop.over }} 
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="40px"
      text-anchor="start",
      :x="10",
      :y="80",
      ) {{ loop.under }}
  g.arrows.pointer-events-none(
    style="mix-blend-mode:difference;"
  )
    line(
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
  metronome-center(
    transform="translate(500,500)"
  )
</template>
  
<script setup>
import { computed } from "vue";
import { getCircleCoord } from 'chromatone-theory'
import { useSequence } from './sequence.js'
import { isDark } from '@theme/composables/state.js'


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
  @apply bg-current transition-all duration-200;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>