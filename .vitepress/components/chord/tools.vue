<template lang="pug">
.flex.flex-col 
  .flex.flex-wrap.mt-4.justify-center
    .chord(
      v-for="chord in chords", 
      :key="chord.handle", 
      @click="accord.info = chord",
      :class="{ active: chord.handle == accord.info.handle }") {{ chord.name }}
  .text-4xl.font-bold.text-center.mt-8
  svg.max-h-3xl(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 100 100",
    xmlns="http://www.w3.org/2000/svg",
  )
    line.line(
      v-for="semitones in accord.info.semitones",
      :key="semitones",
      stroke="#666"
      stroke-linecap="round"
      stroke-width="10"
      opacity="0.8"
      :x1="getCoord(accord.root).x",
      :y1="getCoord(accord.root).y",
      :x2="getCoord(accord.root + semitones).x",
      :y2="getCoord(accord.root + semitones).y"
    )
    g.around(
      v-for="note in notes", 
      :key="note.name",
      @click="selectRoot(note.pitch)",
      :class=`{
        active: isInChord(note.pitch),
        root: accord.root == note.pitch
      }`,
    )
      circle.note(
        :class=`{}`,
        :cx="getCoord(note.pitch).x",
        :cy="getCoord(note.pitch).y",
        r="5",
        :fill="getNoteColor(note.pitch)",
      )
      text.text-4px(
        :fill="scales.minor.steps[note.pitch] ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
        text-anchor="middle",
        dominant-baseline="middle"
        :x="getCoord(note.pitch).x",
        :y="getCoord(note.pitch).y + 0.5",
      ) {{ note.name }}

    text.text-10px.font-bold.text-center(
      :style="{ fill: noteColor(accord.root) }"
      x="50",
      y="50",
      text-anchor="middle",
      dominant-baseline="middle"
      ) {{ notes[accord.root].name }}{{ accord.info.handle }}
</template>

<script setup>
import { reactive } from 'vue'
import { notes, noteColor, chords, scales } from 'chromatone-theory'

const accord = reactive({
  root: 0,
  type: 'min',
  info: chords.min,
});

function selectRoot(n) {
  accord.root = n;
}

function isInChord(n) {
  return accord.info.semitones.includes((12 + n - accord.root) % 12)
}

function getNoteColor(n) {
  if (isInChord(n)) return noteColor(n)
  else if (scales.minor.steps[n]) return 'hsla(0,0%,90%,1)'
  else return 'hsla(0,0%,10%,1)'
}

function getCoord(n, total = 12, radius = 30, width = 100) {
  let angle = ((n - 3) / (total / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
  // For a semicircle, we would use (i / numNodes) * Math.PI.
  let x = (radius * Math.cos(angle)) + (width / 2); // Calculate the x position of the element.
  let y = (radius * Math.sin(angle)) + (width / 2); // Calculate the y position of the element.
  return { x, y }
}
</script>

<style lang="postcss" scoped>
.chord {
  @apply p-2 transition-all cursor-pointer m-1 rounded-lg border bg-light-100 dark:bg-dark-100 hover:bg-light-500 dark:(hover:bg-dark-300);
  &.active {
    @apply bg-light-700 dark:bg-dark-700;
  }
}
.line {
  mix-blend-mode: difference;
}
.around {
  mix-blend-mode: screen;
  @apply cursor-pointer;
  transform-box: fill-box;
  transform-origin: center;
  transition: all 400ms ease-out;
  filter: saturate(0) opacity(50%);
  &.active {
    filter: saturate(1);
    transform: scale(2);
  }
  &.root {
    filter: saturate(1);
    transform: scale(3);
  }
}

.note {
  transition: all 300ms ease-out;
  transform-box: fill-box;
  transform-origin: center;
}
</style>