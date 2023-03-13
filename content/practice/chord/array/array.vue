<script setup>
import tonalNote from './note.vue'
import tonalTrigger from './trigger.vue'

import { rotateArray } from '#/use/calculations'
import { noteColor } from '#/use/colors'
import { notes } from '#/use/theory'
import { computed, reactive } from 'vue'

const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i }))

const tonal = reactive({
  pressed: false,
  r: 28,
  dx: 80,
  rowNum: 12,
  colNum: 12,
  rows: [0, 9, 5, 2, 10],
  bgRows: [4, 0, 9, 5, 2, 10, 7],
  chords: [
    [0, 3, 7],
    [0, 3, 8],
    [0, 5, 8],
    [0, 5, 9],
    [0, 4, 9],
    [0, 4, 7],
  ],
})


const props = defineProps({
  tonic: {
    type: Number,
    default: 0
  },
  chroma: {
    type: String,
    default: '100000000000'
  }
})


const activeSteps = computed(() => {
  let chromaSteps = props.chroma.split('').map(Number)
  let activeSteps = rotateArray(chromaSteps, -props.tonic)
  return activeSteps
})

const dy = computed(() => {
  return tonal.dx * 2 * 0.866
})

const fifths = computed(() => {
  let fifths = []
  for (let n = 0; n < 12; n++) {
    fifths[n] = allNotes[(7 * n) % 12]
  }
  return fifths
})

function hasMajor(pitch) {
  return (
    !activeSteps.value[pitch] ||
    !activeSteps.value[(pitch + 4) % 12] ||
    !activeSteps.value[(pitch + 7) % 12]
  )
}
function hasMinor(pitch) {
  return (
    !activeSteps.value[pitch] ||
    !activeSteps.value[(pitch + 3) % 12] ||
    !activeSteps.value[(pitch + 7) % 12]
  )
}
</script>

<template lang="pug">
svg#tonal-array.rounded-3xl(
  viewBox="-80 -110 1040 770"
  version="1.1",
  baseProfile="full",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  @touchstart.stop.prevent="tonal.pressed = true"
  @touchend.stop.prevent="tonal.pressed = false"
  @mousedown.stop.prevent="tonal.pressed = true"
  @mouseup.stop.prevent="tonal.pressed = false"
  @mouseleave="tonal.pressed = false"
  )
  clipPath#grid-mask
    rect(
      :x="-80", 
      :y="-110", 
      :width="1040", 
      :height="770", 
      :ry="20", 
      :rx="20"
      )
  g(

    v-for="(shift, n) in tonal.bgRows"
    :key="shift"
    clip-path="url(#grid-mask)", 
    )
    g(
      v-for="(note, i) in rotateArray(fifths, shift - 1).splice(0, 7)",
      :key="note"
      :transform="`translate(${((i - 1) * 2 * tonal.dx + ((n + 1) % 2) * tonal.dx)}, ${(n - 1) * dy})`"
      )
      polygon.chord-triangle( 
        :fill="!hasMinor(note.pitch) ? noteColor(note.pitch, 3) : noteColor(note.pitch, 1, 0.2)", 
        points="0,0 160,0 80,138.56"
        )
      polygon.chord-triangle.major(
        :fill="!hasMajor(note.pitch) ? noteColor(note.pitch, 2) : noteColor(note.pitch, 1, 0.2)", 
        points="0,0 160,0 80,-138.56"
        )
      text.chord-name(
        text-anchor="middle", 
        fill="white", 
        :x="80", 
        :y="-40"
        ) {{ note.name }}M
      text.chord-name(
        text-anchor="middle", 
        fill="white", 
        :x="80", 
        :y="55"
        ) {{ note.name }}m
  g.cursor-crosshair(
    v-for="(shift, n) in tonal.rows"
    :key="n"
    )
    g(
      v-for="(note, i) in rotateArray(fifths, shift).splice(0, 7)", 
      :key="note"
      :transform="`translate(${(i * 2 * tonal.dx + (n % 2) * tonal.dx)}, ${n * dy})`"
      )
      tonal-trigger(
        v-for="(chord, p) in tonal.chords", 
        :key="p", 
        :active-steps="activeSteps", 
        :chord="chord", 
        :p="p", 
        :note="note"
        :pressed="tonal.pressed"
        )
  g(
    v-for="(shift, n) in tonal.rows"
    :key="n")
    g(
      v-for="(note, i) in rotateArray(fifths, shift).splice(0, 6)",
      :key="i"
      :transform="'translate(' + (i * 2 * tonal.dx + (n % 2) * tonal.dx) + ',' + n * dy + ')'"
      )
      tonal-note(
        v-model:pressed="tonal.pressed"
        :available="Boolean(activeSteps[note.pitch])", 
        :pressed="tonal.pressed"
        :tonic="tonic", 
        :note="note", 
        :r="tonal.r"
        )
</template>


<style lang="postcss" scoped>
.note-circle,
.chord-trigger,
.chord-triangle {
  transition: all 300ms ease-out;
}

.chord-name {
  font-size: 22px;
  opacity: 1;
  user-select: none;
  pointer-events: none;
  transform-origin: center;
}

.chord-triangle.major {
  opacity: 0.7;
}

.chord-trigger {
  opacity: 0.5;
  mix-blend-mode: screen;
}
</style>
