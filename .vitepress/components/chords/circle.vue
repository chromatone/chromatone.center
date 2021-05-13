<template lang="pug">
svg.max-h-3xl(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  )
  line.line(
    v-for="semitones in accord?.info.semitones",
    :key="semitones",
    stroke="#666"
    stroke-linecap="round"
    stroke-width="10"
    opacity="0.8"
    style="mix-blend-mode: difference;"
    :x1="getCoord(accord?.root).x",
    :y1="getCoord(accord?.root).y",
    :x2="getCoord(accord?.root + semitones).x",
    :y2="getCoord(accord?.root + semitones).y"
  )
  g.around(
    style="mix-blend-mode: screen;"
    v-for="note in notes", 
    :key="note.name",
    @click="$emit('selectRoot', note.pitch)",
    :opacity="isInChord(note.pitch) ? 1 : 0.3"
  )
    circle.note(
      style="transform-box: fill-box"
      :transform="`scale(${accord?.root == note.pitch ? 2.6 : isInChord(note.pitch) ? 1.62 : 1})`",
      transform-origin="center center"
      :class=`{}`,
      :cx="getCoord(note.pitch).x",
      :cy="getCoord(note.pitch).y",
      r="5",
      :fill="getNoteColor(note.pitch)",
    )
    text(
      :fill="scales.minor.steps[note.pitch] ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
      font-family="Commissioner, sans-serif"
      font-size="4px"
      text-anchor="middle",
      dominant-baseline="middle"
      :x="getCoord(note.pitch).x",
      :y="getCoord(note.pitch).y + 0.5",
    ) {{ note.name }}

  text(
    :style="{ fill: noteColor(accord?.root) }"
    x="50",
    y="50",
    font-weight="bold"
    font-size="10px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ notes[accord?.root].name }}{{ accord?.info.handle }}
</template>

<script setup>
import { notes, noteColor, scales } from 'chromatone-theory'
import { defineProps, ref, defineEmit } from 'vue'
const props = defineProps({
  accord: Object,
});

defineEmit(['selectRoot'])



function isInChord(n) {
  return props.accord.info.semitones.includes((24 + n - props.accord.root) % 12)
}

function getNoteColor(n) {
  if (isInChord(n)) return noteColor(n)
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
text {
  font-family: "Commissioner", sans-serif;
}
.line {
  mix-blend-mode: difference;
}
.around {
  @apply cursor-pointer;
  transition: all 400ms ease-out;
}

.note {
  transition: all 300ms ease-out;
  transform-origin: center;
}
</style>