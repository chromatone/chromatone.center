<script setup>
import { computed, reactive, ref } from 'vue';
import db from '#/db/rhythm/40-rudiments.yaml'
import { tempo } from '#/use/tempo';

const box = reactive({
  height: 100
})

function getSx({ ppq = 480, totalTicks = 480 }) {
  const num = 8 * totalTicks / ppq
  return Math.ceil(num) + 1
}

</script>

<template lang='pug'>
.flex.flex-col.gap-6.max-w-150.mx-4
  .p-2.rounded-xl.dark-bg-dark-800.bg-light-200.shadow-lg.flex.flex-col.gap-2.border-1.border-dark-100.border-opacity-15.dark-border-light-900.dark-border-opacity-10(v-for="(pattern,p) in db" :key="p") 
    .flex.flex-wrap.gap-2
      .p-0 {{ pattern.num }}.
      .p-0.font-bold.capitalize {{ pattern.title }}
      .flex-1
      .p-0 {{ pattern.totalNotes }} strokes
      //- .p-0 {{ pattern.totalTicks }} ticks
      //- .flex.flex-wrap.gap-1
        .p-0(v-for="note in selected.tracks[0].notes" :key="note") {{ processNote(note) }}
      svg(
        width="100%" 
        height="100%" 
        :viewBox="`-4 -4 ${pattern.totalTicks+8} ${box.height+8}`"
        )
        rect(
          v-for="note in pattern.notes" 
          :key="note" 
          stroke-width="3" 
          :fill="`hsl(${360*(tempo.pitch/12 + note.ticks/pattern.totalTicks)},30%,${note.velocity*100}%)`"
            :x="note.ticks" 
            :width="note.durationTicks" 
            :y="note.midi==40 ? box.height/2 : 0" 
            :height="box.height/2"
            )
        line.dark-stroke-white.dark-mix-blend-difference.stroke-black(
          v-for="(_,sx) in getSx(pattern)" 
          :key="sx" 
          :y2="box.height" 
          stroke-width="1" 
          :transform="`translate(${sx*60} 0)`")
        line.dark-stroke-white.dark-mix-blend-difference.stroke-black.opacity-70(v-for="(_,i) in 3" :key="i"
          :x2="pattern.totalTicks" 
          :transform="`translate(0 ${i*(box.height/2)})`" 
          )
</template>