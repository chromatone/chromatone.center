<script setup>
import { noteColor } from "#/use/colors";
import { midi } from '#/use/midi';
import { notes } from '#/use/theory';
import { colord } from 'colord';


const width = ref(300)
const height = ref(300)
</script>

<template lang='pug'>
#screen.h-600px.w-full.transition(
  :style="{ backgroundColor: noteColor(midi?.note?.pitch, midi.note?.octA, 1, midi.note?.attack) }"
)
full-screen.absolute.right-4.top-4()


.relative.hidden
  svg-save(svg="brain")
  svg#brain.w-full(
    :width="width * 3 + 30"
    :height="height * 4 + 40"
    viewbox="-10 -10 1300 1000"
    )
    g(
      v-for="(note, n) in notes" :key="note"
      :transform="`translate(${(n % 3) * (width + 10)} ${Math.floor(n / 3) * (height + 10)})`"
      )
      rect(x="0" y="0" width="300" height="150" :fill="colord(`hsl(${n * 30},100%,50%)`).toHex()")
      rect(x="0" y="150" width="300" height="150" :fill="colord(`hsl(${n * 30},100%,35%)`).toHex()")
</template>