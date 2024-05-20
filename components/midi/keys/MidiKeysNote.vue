<script setup>
import { noteColor } from '#/use/colors';
import { midiAttack, midiRelease, useMidi } from '#/use/midi';
import { notes } from '#/use/theory';
import { computed, ref, watch } from 'vue';

import { useGesture } from '@vueuse/gesture';
import { globalScale } from '#/use/chroma';
import { useClamp } from '@vueuse/math'
import { useStorage } from '@vueuse/core'
import { intervals } from '#/use/theory';

const props = defineProps({
  note: { type: Number, default: 0 },
  step: { type: Number, default: 0 },
  width: { type: Number, default: 1200 },
  height: { type: Number, default: 400 },
  pressed: { type: Boolean, default: false }
})

const { midi, playKey } = useMidi()

function startNote(note) {
  let velocity = globalScale.isIn(notes[(note) % 12]) ? 1 : 0.3
  playKey(note - 7, 0, false, velocity)
  midiAttack({ number: note - 3 })
}

function stopNote(note) {
  playKey(note - 7, 0, true, 0)
  midiRelease({ number: note - 3 })
}

const noteKey = ref()
</script>

<template lang='pug'>
g.note(
  :transform="`translate(${step*width},0)`"
  text-anchor="middle",
  ref="noteKey"
  )
  rect(
    :width="width"
    :height="height"
    :fill="noteColor(note+3, null, midi.activeNotes[note] ? 1 : 0.1,globalScale.isIn(notes[(note+3)%12]) ? 1 : .4)"
    @pointerdown.prevent="startNote(note+3)", 
    @pointerenter="pressed ? startNote(note+3) : null"
    @pointerleave="stopNote(note+3)", 
    @pointerup.prevent="stopNote(note+3)", 
    @touchcancel="stopNote(note+3)"
    )
  g.marks.pointer-events-none
    line(
      :x1="width/2",
      :x2="width/2"
      :y1="0"
      :y2="height"
      stroke-width="6"
      :opacity=".9"
      :stroke="midi.activeNotes[note] ? 'white' : noteColor(note+3, -1, 1,1)"
      v-if="globalScale.tonic == (note+3)%12"
      )
    circle(
      :r="globalScale.tonic == (note+3)%12 ? width/3 : width/8"
      :cx="width/2"
      :cy="height-width/2"
      :opacity="midi.activeNotes[note] ? 1 :.3"
      :fill="globalScale.isIn(notes[(note+3)%12]) ? 'white' : 'black'"
      )

    text.opacity-75.number(
      :x="width/2"
      :y="width*1.8"
      :font-size="width*.333"
      ) {{ intervals[(note+3 -globalScale.tonic)%12] }}
    text.opacity-55(
      :x="width/2"
      :y="width+14"
      :font-size="width*.333"
      ) {{ note }}
    text(
      :fill="globalScale.isIn(notes[(note+3)%12]) ?  'black' : '#777e'"
      :y="width/2+10"
      :x="width/2"
      :font-size="width*.5"
      :font-weight="globalScale.tonic == (note+3)%12 ? 'bold' : 'normal'"
      ) {{ notes[(note+3)%12] }}
</template>