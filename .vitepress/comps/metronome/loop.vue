<template lang="pug">
g(
  text-anchor="middle",
  style="user-select:none;transition:all 300ms ease"
)
  g.opacity-20
    circle(
      cx="500"
      cy="500"
      :r="radius + 52"
      stroke-width="2"
      fill="transparent"
      stroke="currentColor"
    )
    circle(
      cx="500"
      cy="500"
      :r="radius - 52"
      stroke-width="2"
      fill="transparent"
      stroke="currentColor"
    )
  g.steps(
    :opacity="volume / 2 + 0.5"
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
  svg-ring(
    :cx="500"
    :cy="500"
    :from="340"
    :to="20"
    :fill="isDark ? '#333' : '#eee'"
    :radius="495 - order * 175"
    :thickness="60"
  )
  g.sound(
    :transform="`translate(${order * 175 + 30}, 500)`"
  )
    g.sound.cursor-pointer(
      v-for="(pos,sound) in sounds"
      :key="pos"
      @click="$emit('sound', sound)"
      :class="{ active: sound == loop.sound }"
      )
      circle(
        :cx="pos[0]"
        :cy="pos[1]"
        stroke-width="3"
        r="25"
        :fill="isDark ? 'hsla(0,0%,30%,0.4)' : 'hsla(0,0%,100%,0.8)'"
        )
      text(
        fill="currentColor"
        stroke-width=0
        :x="pos[0]"
        :y="pos[1] + 8"
        font-size="25"
      ) {{ sound }}
  g.vol(
    style="cursor:pointer;color:currentColor"
    :transform="`translate(${970 - order * 182}, 550)`"
    font-size="32px"
    @dblclick="volume > 0 ? volume = 0 : volume = 0.75"
    )
    line(
      y2="-100"
      :stroke="isDark ? '#333' : '#fefefe'"
      stroke-width="12"
      stroke-linecap="round"
    )
    g.dragger(
      :transform="`translate(0,${-volume * 100})`"
      v-drag="dragVol"
    )
      circle(
        :r="24"
        :cx="0"
        :cy="0"
        fill="var(--c-bg)"
      )
      la-volume-off(
        v-if="volume == 0"
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
  g.pan(
    style="cursor:pointer;color:currentColor"
    :transform="`translate(500,${970 - order * 182})`"
    font-size="32px"
    @dblclick="volume > 0 ? volume = 0 : volume = 0.75"
    )
    line(
      x1="-50"
      x2="50"
      :stroke="isDark ? '#333' : '#fefefe'"
      stroke-width="12"
      stroke-linecap="round"
    )
    g.dragger(
      :transform="`translate(${panning * 50},0)`"
      v-drag="dragPan"
    )
      circle(
        :r="24"
        :cx="0"
        :cy="0"
        fill="var(--c-bg)"
      )
      mdi-pan-horizontal(
        :x="-20"
        :y="-20"
      )

  g.info(
    :transform="`translate(500,${order * 175 - 30})`"
  )
    text(
      fill="currentColor"
      font-size="45"
      y="78"
    ) :
    g.under.cursor-pointer(
      @click="$emit('under', -1)"
      transform="translate(110,72)"
    )
      circle(
        cx="14"
        cy="14"
        r="20"
        :fill="isDark ? '#222' : '#fff'"
      )
      la-minus
    g.over.cursor-pointer(
      @click="$emit('under', 1)"
      transform="translate(60,60)"
    )
      circle(
        cx="14"
        cy="14"
        r="20"
        :fill="isDark ? '#222' : '#fff'"
      )
      la-plus
    g.over.cursor-pointer(
      @click="$emit('over', -1)"
      transform="translate(-140,72)"
    )
      circle(
        cx="14"
        cy="14"
        r="20"
        :fill="isDark ? '#222' : '#fff'"
      )
      la-minus
    g.over.cursor-pointer(
      @click="$emit('over', 1)"
      transform="translate(-90,60)"
    )
      circle(
        cx="14"
        cy="14"
        r="20"
        :fill="isDark ? '#222' : '#fff'"
      )
      la-plus
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="40px"
      text-anchor="end",
      :x="-10",
      :y="82",
      ) {{ loop.over }} 
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="40px"
      text-anchor="start",
      :x="10",
      :y="82",
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
import { clampNum } from '@use/theory'


defineEmits(['del', 'over', 'under', 'sound'])

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
      over: 4,
      under: 4,
      sound: 'A'
    }
  }
});

const sounds = {
  A: [26, -120],
  B: [10, -60],
  C: [2, 0],
  D: [10, 60],
  E: [26, 120]
}

const { progress, current, steps, mutes, volume, panning } = useSequence(props.loop, props.order)

const lineProgress = computed(() => {
  if (progress.value > 0) {
    return getCircleCoord(progress.value * 360, 360, props.radius + 50, 1000)
  } else {
    return { x: 500, y: 100 }
  }
});

function dragVol(drag) {
  volume.value = clampNum(volume.value, -drag.delta[1] / 100, 0, 1)
}

function dragPan(drag) {
  panning.value = clampNum(panning.value, drag.delta[0] / 100, -1, 1)
}

</script>
  
<style scoped>
.info {
  @apply p-2 rounded-full m-1 border-1 border-current text-2xl;
}

.active {
  stroke: currentColor;
  font-weight: bold;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-200;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>