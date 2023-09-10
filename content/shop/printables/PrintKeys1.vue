<script setup>
import { colord } from 'colord'
import { noteColor } from "#/use/colors"
import { notes } from '#/use/theory'
const props = defineProps({
  pitch: { type: Number, default: 0 },
  chroma: { type: String, default: '100100010010' },
  type: { type: String, default: '' },
  tonic: { type: Number, default: 0 },
});

const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i, pos: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0][n] ? 1 : 0 }))

const whites = [3, 5, 7, 8, 10, 0, 2].map(n => allNotes[n])
const blacks = [4, 6, false, 9, 11, 1].map(n => allNotes[n])

defineEmits([])

function isInChord(n) {
  return props.chroma.split('')[n] == '1'
}

function getNoteColor(n) {
  if (isInChord(n % 12)) return noteColor(n % 12)
  else if ([1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0][n]) return 'hsl(0,0%,90%)'
  else return '#aaaa'
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
        :y="![1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0][note.pitch] ? 55 : 88",
      ) {{ note?.name }}
    text(
      text-anchor="start",
      x="2"
      y="-15"
      font-size="22"
    ) {{notes[pitch]}}{{ type }}
</template>

<style lang="postcss" scoped></style>