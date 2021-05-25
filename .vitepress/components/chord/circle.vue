<template lang="pug">
svg.max-h-3xl.w-full(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  )
  line.line(
    v-for="semitones in pcset?.info.semitones",
    :key="semitones",
    :stroke="pitchColor(pcset?.root)"
    stroke-linecap="round"
    stroke-width="10"
    opacity="0.5"
    style="mix-blend-mode: multiply;"
    :x1="getCoord(pcset?.root).x",
    :y1="getCoord(pcset?.root).y",
    :x2="getCoord(pcset?.root + semitones).x",
    :y2="getCoord(pcset?.root + semitones).y"
  )
  g.around(
    style="mix-blend-mode: screen;cursor:pointer"
    v-for="note in notes", 
    :key="note.name",
    @click="$emit('selectRoot', note.pitch)",
    :opacity="isInChord(note.pitch) ? 1 : 0.3"
  )
    circle.note(
      style="transform-box: fill-box; transform-origin: center center;"
      :style="{ transform: `scale(${pcset?.root == note.pitch ? 2.6 : isInChord(note.pitch) ? 1.62 : 1}` }",
      :cx="getCoord(note.pitch).x",
      :cy="getCoord(note.pitch).y",
      r="5",
      :fill="getPitchColor(note.pitch)",
    )
    text(
      style="user-select:none;transition:all 300ms ease"
      :fill="scales.minor.steps[note.pitch] ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
      font-family="Commissioner, sans-serif"
      font-size="4px"
      text-anchor="middle",
      dominant-baseline="middle"
      :x="getCoord(note.pitch).x",
      :y="getCoord(note.pitch).y + 0.5",
    ) {{ note.name }}

  text(
    style="cursor:pointer;user-select:none"
    :style="{ fill: pitchColor(pcset?.root) }"
    x="50",
    y="50",
    font-weight="bold"
    font-size="10px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ notes[pcset?.root].name }}{{ pcset?.info.handle }}
</template>

<script setup>
import { notes, pitchColor, scales } from 'chromatone-theory'
import { defineProps, ref, defineEmit } from 'vue'
const props = defineProps({
  pcset: Object,
});

defineEmit(['selectRoot'])

function isInChord(n) {
  return props.pcset.info.semitones.includes((24 + n - props.pcset.root) % 12)
}

function getPitchColor(n) {
  if (isInChord(n % 12)) return pitchColor(n % 12)
  else if (scales.minor.steps[n]) return 'hsla(0,0%,90%,1)'
  else return 'hsla(0,0%,10%,1)'
}

function getCoord(n, total = 12, radius = 35, width = 100) {
  let angle = ((n - 3) / (total / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
  // For a semicircle, we would use (i / numNodes) * Math.PI.
  let x = (radius * Math.cos(angle)) + (width / 2); // Calculate the x position of the element.
  let y = (radius * Math.sin(angle)) + (width / 2); // Calculate the y position of the element.
  return { x, y }
}
</script>

<style lang="postcss"  scoped>
.around {
  transition: all 400ms ease-out;
}

.note {
  transition: all 300ms ease-out;
}
</style>