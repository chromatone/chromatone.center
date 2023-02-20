<script setup>
import { notes } from '#/use/theory'
import { getCircleCoord } from '#/use/calculations'
import { globalScale } from '#/use/chroma'
import { noteColor } from '#/use/colors'
</script>

<template lang="pug">
.relative.h-500px.w-500px.bg-light-100.bg-opacity-10.preserve-3d.origin-top.pointer-events-noner
  .notes.preserve-3d.perspect-3.origin-center.m-auto
    .note.bg-light-500.origin-top.cursor-pointer(
      v-for="(note, n) in notes" 
      :key="note"
      :style="{ backgroundColor: noteColor(n + globalScale.tonic), transform: `translate3d(${getCircleCoord(n, 12, 200, 420).x}px,200px,${-getCircleCoord(n, 12, 5, -2).y}px)` }"
      @click="globalScale.tonic = n"
      )
</template>

<style lang="postcss" scoped>
.note {
  @apply rounded-full p-10 absolute;
  transition: all 300ms ease;
  background-image: radial-gradient(at top, #fffe, 60%, #0005);
}
</style>