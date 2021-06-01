<template lang="pug">
.flex.flex-col.items-stretch.mb-6.w-full
  .flex.flex-wrap.justify-center.border-b-1.pt-2.mb-2(v-if="!chord.empty || scale") 
    .chord.cursor-pointer(@click="playChordOnce()") {{ notes[tonic].name }}{{ chord.aliases[0] }} &nbsp;
    .title.cursor-pointer.text-gray-500(class="dark:text-gray-400",  @click="arpeggiate()")  {{ chord.name }} 
    .scale(v-if="scale") @ {{ scale }} scale
  .grid.grid-cols-12.justify-items-stretch
    .chroma-key(
      @mouseenter="bit == 1 && playNote(i + tonic)"
      @touchstart="bit == 1 && playNote(i + tonic)"
      v-for="(bit,i) in set?.chroma.split('')"
      :key="i"
      :class="{ active: bit == 1 }"
      :style="{ backgroundColor: bit == 1 ? pitchColor((i + tonic) % 12) : minor[(i + tonic) % 12] == '1' ? 'hsla(0,0%,80%,0.3)' : 'hsla(0,0%,20%,0.3)' }"
      ) {{ bit == 1 ? notes[(i + tonic) % 12].name : i }}
</template>

<script setup>
import { defineProps, computed, defineEmit, nextTick } from 'vue'
import { ChordType, ScaleType } from '@tonaljs/tonal'
import { pitchColor, notes } from 'chromatone-theory'
import { Note } from '@tonaljs/tonal'
import { Frequency } from 'tone'
import { synthOnce } from '@use/synth.js'
import { midiOnce } from '@use/midi.js'

const props = defineProps({
  set: Object,
  tonic: {
    type: Number,
    default: 0
  }
});

const chordNotes = computed(() => {
  let shiftChroma = rotate(props.set.chroma.split(''), -props.tonic)
  let chOct = rotate(notes, -props.tonic).map((n, i) => {
    return Frequency(n.pitch + props.tonic + 57, 'midi').toNote()
  })
  let filtered = chOct.filter((val, i) => {
    if (shiftChroma[i] == '1') {
      return true
    }
  })
  return Note.sortedNames(filtered)
})

function playChordOnce() {
  chordNotes.value.forEach(name => {
    midiOnce({ name: name })
  })
  synthOnce(chordNotes.value, '4n')
}

function arpeggiate() {
  chordNotes.value.forEach((note, i) => {
    synthOnce(note, '8n', `+${i / 3}`)
  })
}

function playNote(note = 0, octave = 0) {
  let freq = Frequency(note + 57, 'midi')
  midiOnce({ name: freq.toNote() })
  synthOnce(freq.toNote())
}

function rotate(arr, count = 1) {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
};
const minor = "101101011010"

const chord = ChordType.get(props.set.chroma)
const scale = ScaleType.get(props.set.chroma).name
</script>

<style lang="postcss" scoped>
.chroma-key {
  @apply grid cursor-pointer place-content-center text-xs transition-all duration-300 p-1 py-3  mx-4px sm:(py-4) hover:(opacity-100) opacity-80  rounded-md;
}
.chroma-key.active {
  @apply text-light-100 font-bold;
}
</style>