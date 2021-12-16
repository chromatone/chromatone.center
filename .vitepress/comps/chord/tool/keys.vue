<template lang="pug">
svg.max-h-sm.w-full(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 240 100",
  xmlns="http://www.w3.org/2000/svg",
  )
  g(
    style="cursor:pointer; transition:all 300ms ease"
    v-for="(note,i) in notes"
    :key="note.pitch"
    @click="$emit('selectRoot', i)"
  )
    rect(
      style="transition:all 300ms ease"
      :x="20 * ((12 - 3 + Number(i)) % 12)"
      :y="2"
      :width="18"
      :stroke-width="accord?.root == i ? 1 : 0"
      stroke="#000"
      :height="note.pos == 1 ? 70 : 90"
      :rx="5"
      :ry="5"
      :fill="getNoteColor(i)"
    )
    text(
      style="user-select:none; transition:all 300ms ease"
      :fill="scales.minor.steps[note.pitch] ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
      font-family="Commissioner, sans-serif"
      font-size="10px"
      text-anchor="middle",
      dominant-baseline="middle"
      :x="20 * ((12 - 3 + Number(i)) % 12) + 9",
      :y="note.pos == 1 ? 60 : 80",
    ) {{ note.name }}


</template>

<script setup>
import { notes, pitchColor, scales } from '@theory'
const props = defineProps({
  accord: Object,
});

const whites = [...notes].filter(note => note.pos == 0)
const blacks = [...notes].filter(note => note.pos == 1)


defineEmits([
  'selectRoot'
])

function isInChord(n) {
  return props.accord.info.semitones.includes((24 + n - props.accord.root) % 12)
}

function getNoteColor(n) {
  if (isInChord(n % 12)) return pitchColor(n % 12)
  else if (scales.minor.steps[n]) return 'hsla(0,0%,90%,1)'
  else return 'hsla(0,0%,40%,1)'
}
</script>

<style scoped>
</style>