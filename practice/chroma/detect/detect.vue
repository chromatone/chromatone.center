<script setup>
import { pitchColor, rotateArray, getCircleCoord } from '#use/calculations'
import { notes } from '#use/theory'
import { useTuner } from '#use/tuner.js'
const { init, tuner, chain } = useTuner();

const blur = ref(0)
const filter = computed(() => `blur(${blur.value}px)`)
const radius = useClamp(2, 1, 5)
</script>

<template lang="pug">
.fullscreen-container.rounded-4xl
  control-start.absolute(v-if="!tuner.initiated" @click="init()") Start
  full-screen.absolute.bottom-6.right-6.z-30
  svg.max-h-3xl.w-full#screen(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  )
    circle.note(
      style="transition: all 300ms ease-in-out;transform-box: fill-box; transform-origin: center center;"
      :cx="50",
      :cy="50",
      :r="10",
      :style="{ transform: `scale(${0.5 + 20 * tuner.rms})` }"
      :fill="tuner.note.silent ? '#888' : tuner?.note.color",
    )
    text(
      style="user-select:none;transition:all 300ms ease"
      fill="white"
      font-family="Commissioner, sans-serif"
      font-size="3px"
      text-anchor="middle",
      dominant-baseline="middle"
      :x="50",
      :y="50",
      ) {{ tuner.note.name }} 
    g.around(
      style="cursor:pointer"
      v-for="(amount, i) in rotateArray(tuner.chroma, -3)", 
      :key="i",
      :transform="`translate(${getCircleCoord(i).x},${getCircleCoord(i).y})`"
    )
      circle.note(
        style="transition: all 300ms ease-in-out;transform-box: fill-box; transform-origin: center center;"
        :r="radius",
        :style="{ transform: `scale(${0.5 + 10 * amount})` }"
        :fill="pitchColor(i, 3, amount)",
      )
      text(
        style="user-select:none;transition:all 300ms ease"
        :fill="notes[i].length == 2 ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
        font-family="Commissioner, sans-serif"
        font-size="3px"
        text-anchor="middle",
        dominant-baseline="middle"
      ) {{ notes[i] }} 
  .flex
    control-rotary(
      param="blur"
      :min="0"
      :max="10"
      :step="0.1"
      v-model="blur"
      )
    control-rotary(
      param="radius"
      :min="1"
      :max="5"
      :step="0.1"
      v-model="radius"
      )
</template>

<style lang="postcss" scoped>
.note {
  filter: v-bind(filter);
  /* @apply mix-blend-screen; */
}
</style>