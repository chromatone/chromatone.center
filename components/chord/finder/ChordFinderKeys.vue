<script setup>
import { notes } from '#/use/theory'
import { noteColor } from "#/use/colors"
import { globalScale } from '#/use/global';

const props = defineProps({
  accord: { type: Object, default: () => { } },
});

defineEmits([
  'selectRoot'
])

function isInChord(n) {
  return props.accord.info.semitones.includes((24 + n - globalScale.tonic) % 12)
}

function getNoteColor(n) {
  if (isInChord(n % 12)) return noteColor(n % 12)
  else if (notes[n].length != 2) return 'hsla(0,0%,90%,1)'
  else return 'hsla(0,0%,40%,1)'
}
</script>

<template lang="pug">
svg.max-h-sm.w-full(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 240 100",
  xmlns="http://www.w3.org/2000/svg",
  )
  g(
    v-for="(note, pitch) in notes"
    :key="pitch"
    style="cursor:pointer; transition:all 300ms ease"
    @click="$emit('selectRoot', pitch)"
  )
    rect(
      style="transition:all 300ms ease"
      :x="20 * ((12 - 3 + Number(pitch)) % 12)"
      :y="2"
      :width="18"
      :stroke-width="globalScale.tonic == pitch ? 1 : 0"
      stroke="#000"
      :height="note.length == 2 ? 70 : 90"
      :rx="5"
      :ry="5"
      :fill="getNoteColor(pitch)"
    )
    text(
      style="user-select:none; transition:all 300ms ease"
      :fill="notes[pitch].length == 2 ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
      font-family="Commissioner, sans-serif"
      font-size="10px"
      text-anchor="middle",
      dominant-baseline="middle"
      :x="20 * ((12 - 3 + Number(pitch)) % 12) + 9",
      :y="note.length == 2 ? 60 : 80",
    ) {{ note }}


</template>

<style lang="postcss" scoped></style>