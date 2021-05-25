<template lang="pug">
g.note
  circle(
    style="transition:all 300ms ease-in-out; "
    :fill="active ? pitchColor(i + tonic, 3) : note.pos == 1 ? 'hsla(0,0%,0%,0.6)' : 'hsla(0,0%,100%,0.6)'"
    :cx="i * 100 + 50"
    :cy="70"
    :r="i == 0 ? 50 : 36"
  )
  text(
    style="user-select:none;transition:all 300ms ease; "
    :fill="active ? 'white' : note.pos == 1 ? 'white' : 'black'"
    font-family="Commissioner, sans-serif"
    font-size="2rem"
    :font-weight="active ? 'bold' : 'normal'"
    text-anchor="middle",
    dominant-baseline="middle"
    :x="i * 100 + 50"
    y="73"
  ) {{ note.name }}
</template>

<script setup>
import { pitchColor } from 'chromatone-theory'
import { defineProps } from 'vue'
const props = defineProps({
  i: Number,
  tonic: Number,
  note: Object,
  active: Boolean
});
</script>

<style lang="postcss" scoped>
.note {
  @apply cursor-pointer transition-all duration-200 ease-in-out;
  filter: brightness(1);
}

.note:hover {
  filter: brightness(1.2);
}
</style>