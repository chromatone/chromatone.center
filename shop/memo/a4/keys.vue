<script setup>
import { colord } from 'colord'
import { pitchColor } from '@use/calculations'
import { notes, scales } from '@use/theory'
const props = defineProps({
  chroma: { type: String, default: '100100010010' },
});

const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i }))

const whites = [3, 5, 7, 8, 10, 0, 2].map(n => allNotes[n])
const blacks = [4, 6, false, 9, 11, 1].map(n => allNotes[n])

defineEmits([])

function isInChord(n) {
  return props.chroma.split('')[n] == '1'
}

function getNoteColor(n) {
  if (isInChord(n % 12)) return pitchColor(n % 12)
  else if (scales.minor.steps[n]) return 'hsl(0,0%,90%)'
  else return 'hsl(0,0%,50%)'
}
</script>

<template lang="pug">
g
  g(
    v-for="(keys, k) in [whites, blacks]" :key="k"
    )
    g(
      v-for="(note, i) in keys"
      :key="i"
    )
      rect(
        v-if="note"
        :x="25 * i + 15 * k"
        :y="0"
        :width="22 - k * 4"
        :height="100 - 35 * k"
        :rx="5"
        :ry="5"
        :fill="colord(getNoteColor(note?.pitch)).toHex()"
      )
      text(
        v-if="note && isInChord(note.pitch)"
        fill="white"
        font-family="Commissioner, sans-serif"
        font-size="10px"
        font-weight="bold"
        text-anchor="middle",
        dominant-baseline="middle"
        :x="25 * (i % 12) + 11 + 13 * k",
        :y="note?.pos == 1 ? 55 : 88",
      ) {{ note?.name }}

</template>

<style lang="postcss" scoped>
</style>