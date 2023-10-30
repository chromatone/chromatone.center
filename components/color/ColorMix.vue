<script setup>
import { noteColor } from "#/use/colors";
import { midi } from '#/use/midi';
import { notes } from '#/use/theory';
import { watchOnce } from "@vueuse/core";
import { colord } from 'colord';
import { computed, ref } from "vue";


const width = ref(300)
const height = ref(300)

const activeColors = computed(() => Object.entries(midi.activeNotes)?.map(([n, v]) => noteColor(+n + 3, -2, v.toFixed(2), v.toFixed(2))))

const mix = computed(() => activeColors.value?.reduce((prev, next) => prev.mix(next), colord(activeColors.value[0])))

const started = ref(false)

watchOnce(() => midi.note, () => started.value = true)

</script>

<template lang="pug">
#screen.h-80svh.w-full.transition.flex.flex-col.relative(
  :style="{ backgroundColor: '' }"
  )
  transition(name="fade")
    .absolute.top-30.text-xl.max-w-120.p-8.font-bold(v-if="!started") Play any notes on your keyboard to see their colors and how they mix together
  .flex.flex-1
    .flex-1.transition.py-16(
      v-for="(color,c) in activeColors" :key="c"
        :style="{ backgroundColor: color }"
        )

  .flex-1.transition(
    :style="{ backgroundColor: mix.toHex() }"
    )

.relative.hidden
  save-svg(svg="brain")
  svg#brain.w-full(
    :width="width * 3 + 30"
    :height="height * 4 + 40"
    viewbox="-10 -10 1300 1000"
    )
    g(
      v-for="(note, n) in notes" 
      :key="note"
      :transform="`translate(${(n % 3) * (width + 10)} ${Math.floor(n / 3) * (height + 10)})`"
      )
      rect(
        x="0" 
        y="0" 
        width="300" 
        height="150" 
        :fill="colord(`hsl(${n * 30},100%,50%)`).toHex()")
      rect(
        x="0" 
        y="150" 
        width="300" 
        height="150" 
        :fill="colord(`hsl(${n * 30},100%,35%)`).toHex()")
</template>