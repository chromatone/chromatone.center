<script setup>
import { ref } from 'vue';

import { noteColor } from '#/use/colors';
import { useMidi } from '#/use/midi';
import { notes } from '#/use/theory';
import { globalScale } from '#/use/global';
import { intervals } from '#/use/theory';



const props = defineProps({
  note: { type: Number, default: 0 },
  step: { type: Number, default: 0 },
  width: { type: Number, default: 1200 },
  height: { type: Number, default: 400 },
  pressed: { type: Boolean, default: false }
})

const { activeNotes } = useMidi()

function logCurve(x, factor = 10) {
  // Ensure x is between 0 and 1
  x = Math.max(0, Math.min(1, x));
  // Apply logarithmic curve and normalize to 0-1 range
  return Math.log(1 + factor * x) / Math.log(1 + factor);
}

// Remove startKey function as it will be handled by parent

const noteKey = ref()

</script>

<template lang='pug'>
g.note(
  :transform="`translate(${step * width},0)`"
  text-anchor="middle",
  ref="noteKey"
  )
  rect.note-cell(
    :data-note="note"
    :width="width"
    :height="height"
    :fill="noteColor(note + 3, null, activeNotes[note] ? 1 : 0.1, globalScale.isIn(notes[(note + 3) % 12]) ? 1 : .4)"
    )
  g.marks.pointer-events-none
    line(
      :x1="width / 2",
      :x2="width / 2"
      :y1="0"
      :y2="height"
      stroke-width="6"
      :opacity=".9"
      :stroke="activeNotes[note] ? 'white' : noteColor(note + 3, -1, 1, 1)"
      v-if="globalScale.tonic == (note + 3) % 12"
      )
    circle(
      :r="globalScale.tonic == (note + 3) % 12 ? width / 3 : width / 8"
      :cx="width / 2"
      :cy="height - width / 2"
      :opacity="activeNotes[note] ? 1 : .3"
      :fill="globalScale.isIn(notes[(note + 3) % 12]) ? 'white' : 'black'"
      )

    text.opacity-75.number(
      :x="width / 2"
      :y="width * 1.8"
      :font-size="width * .333"
      ) {{ intervals[(note + 3 - globalScale.tonic) % 12] }}
    text.opacity-55(
      :x="width / 2"
      :y="width + 14"
      :font-size="width * .333"
      ) {{ note }}
    text(
      :fill="globalScale.isIn(notes[(note + 3) % 12]) ? 'black' : '#777e'"
      :y="width / 2 + 10"
      :x="width / 2"
      :font-size="width * .5"
      :font-weight="globalScale.tonic == (note + 3) % 12 ? 'bold' : 'normal'"
      ) {{ notes[(note + 3) % 12] }}
</template>