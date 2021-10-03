<template lang="pug">
g(
  text-anchor="middle",
  style="user-select:none;transition:all 300ms ease"
)
  g.opacity-20
    rect(
      width="1000"
      height="280"
      stroke="currentColor"
    )
  g.steps(
    :opacity="volume / 2 + 0.5"
    transform="translate(0,100)"
  )
    metronome-bars-step(
      v-for="(step,s) in steps"
      :key="step"
      :active="!mutes[s + 1] && step == current"
      @mute="mutes[s + 1] = !mutes[s + 1]"
      @subdivide="steps[s] = $event"
      :opacity="mutes[step] ? 0.1 : 1"
      :step="s + 1"
      :current="current"
      :subdivisions="step"
      :proportion="proportion"
      :total="steps.length"
      :transform="`translate(${proportion * s * 1000},0)`"
    )
    g.arrows.pointer-events-none(
      style="mix-blend-mode:difference;"
    )
      line(
        :x1="progress * 1000 * proportion * loop.over"
        stroke-width="8"
        stroke="currentColor"
        stroke-linecap="round"
        :x2="progress * 1000 * proportion * loop.over"
        :y2="180"
      )

  g.sound.cursor-pointer(
    v-for="(sound,s) in sounds"
    :key="sound"
    @click="$emit('sound', sound)"
    :class="{ active: sound == loop.sound }"
    :transform="`translate(${s * 55 + 10},10)`"
    )
    rect(
      width="50"
      height="50"
      stroke-width="3"
      rx="15"
      :fill="isDark ? 'hsla(0,0%,30%,0.4)' : 'hsla(0,0%,100%,0.8)'"
      )
    text(
      fill="currentColor"
      stroke-width=0
      y="33"
      x="25"
      font-size="25"
    ) {{ sound }}
  g.del.cursor-pointer(
    @click="$emit('del')"
    :transform="`translate(940,15)`"
    )
    rect(
      width="50"
      height="50"
      stroke-width="3"
      rx="15"
      :fill="isDark ? 'hsla(0,0%,30%,0.4)' : 'hsla(0,0%,100%,0.8)'"
      )
    la-times(
      color="currentColor"
      stroke-width=0
      y="4"
      x="4"
      font-size="35"
    )

  g.vol(
    style="cursor:pointer;color:currentColor"
    :transform="`translate(810, 40)`"
    font-size="32px"
    @dblclick="volume > 0 ? volume = 0 : volume = 0.75"
    )
    line(
      x2="100"
      :stroke="isDark ? '#555' : '#fefefe'"
      stroke-width="12"
      stroke-linecap="round"
    )
    g.dragger.opacity-80(
      v-drag="dragVol"
      :transform="`translate(${volume * 100})`"
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

  metronome-pan(
    v-model:pan="panning"
    :transform="`translate(730,40)`"
    :order="order"
  )

  g.info(
    :transform="`translate(500,50)`"
  )
    g.controls(
      transform="translate(0,-30)"
      font-size="30"
    )
      g.under.cursor-pointer(
        @click="$emit('under', -1)"
        transform="translate(110,0)"
      )
        rect(
          width="40"
          height="40"
          rx="12"
          :fill="isDark ? '#222' : '#fff'"
        )
        la-minus
      g.over.cursor-pointer(
        @click="$emit('under', 1)"
        transform="translate(60,0)"
      )
        rect(
          width="40"
          height="40"
          rx="12"
          :fill="isDark ? '#222' : '#fff'"
        )
        la-plus
      g.over.cursor-pointer(
        @click="$emit('over', -1)"
        transform="translate(-145,0)"
      )
        rect(
          width="40"
          height="40"
          rx="12"
          :fill="isDark ? '#222' : '#fff'"
        )
        la-minus
      g.over.cursor-pointer(
        @click="$emit('over', 1)"
        transform="translate(-95,0)"
      )
        rect(
          width="40"
          height="40"
          rx="12"
          :fill="isDark ? '#222' : '#fff'"
        )
        la-plus

    text(
      fill="currentColor"
      font-size="45"
    ) :
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="40px"
      text-anchor="end",
      :x="-10",
      ) {{ loop.over }} 
    text(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="40px"
      text-anchor="start",
      :x="10",
      ) {{ loop.under }}

</template>

<script setup>
import { useSequence } from '../sequence.js'
import { isDark } from '@theme/composables/state.js'
import { clampNum } from '@use/theory'

defineEmits(['del', 'over', 'under', 'sound']);

const props = defineProps({
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
  },
  maxRatio: {
    type: Number,
    default: 1
  }
});

const sounds = ['A', 'B', 'C', 'D', 'E', 'F']

const { progress, current, steps, mutes, volume, panning } = useSequence(props.loop, props.order);

const proportion = computed(() => ((props.loop.over / props.loop.under) / props.maxRatio) / props.loop.over)

function dragVol(drag) {
  volume.value = clampNum(volume.value, drag.delta[0] / 100, 0, 1)
}

</script>

<style scoped>
g {
  transition: fill 300ms ease;
}
.active {
  stroke: currentColor;
}
</style>