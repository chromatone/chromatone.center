<template lang="pug">
.flex.flex-wrap.items-stretch.mx-auto
  .grid.grid-cols-12.justify-items-stretch.mb-2
    .chroma-key(
      @mouseenter="hover(i, bit)"
      @touchstart="hover(i, bit)"
      v-for="(bit,i) in chroma.split('')"
      :key="i"
      @click="globalScale.tonic = (i + globalScale.tonic) % 12"
      :class="{ active: bit == 1 }"
      :style="{ backgroundColor: calcBg(i, bit) }"
      ) {{ bit == 1 ? notes[(i + globalScale.tonic) % 12].name : i }}
  .flex.flex-wrap.justify-center.border-b-1.px-2(v-if="!state.chord.empty || state.scale") 
    button.m-1.shadow.px-2.py-1.font-bold.cursor-pointer(@click="playChordOnce()") {{ notes[globalScale.tonic].name }}{{ state.chord.aliases[0] }} &nbsp;
    button.m-1.shadow.px-2.py-1.cursor-pointer.text-gray-500(v-if="state.chord.name" class="dark:text-gray-400",  @click="arpeggiate()")  {{ state.chord.name }} 
    button.m-1.scale.p-2.font-bold(v-if="state.scale"  @click="arpeggiate()") {{ state.scale }} scale
</template>

<script setup>
import { computed, nextTick } from 'vue'
import { ScaleType } from '@tonaljs/tonal'
import { pitchColor, notes } from 'chromatone-theory'
import { Note } from '@tonaljs/tonal'
import { Frequency } from 'tone'
import { synthOnce } from '@use/synth.js'
import { midiOnce } from '@use/midi.js'
import { globalScale, chordType } from '@use/theory.js'

const props = defineProps({
  chroma: {
    type: String,
  },
});

const state = reactive({
  minor: "101101011010",
  chord: computed(() => chordType.get(props.chroma)),
  scale: computed(() => ScaleType.get(props.chroma).name),
})

function hover(i, bit) {
  if (bit == 1) {
    playNote(i + globalScale.tonic)
  }
}

function calcBg(i, bit, hover) {
  if (bit == 1) {
    return pitchColor((i + globalScale.tonic) % 12)
  } else if (state.minor[(i + globalScale.tonic) % 12] == '1') {
    return 'hsla(0,0%,80%,0.3)'
  } else {
    return 'hsla(0,0%,20%,0.3)'
  }
}

const chordNotes = computed(() => {
  let shiftChroma = rotate(props.chroma.split(''), -globalScale.tonic)
  let chOct = rotate(notes, -globalScale.tonic).map((n, i) => {
    return Frequency(n.pitch + globalScale.tonic + 57, 'midi').toNote()
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


</script>

<style  scoped>
.chroma-key {
  @apply grid cursor-pointer place-content-center text-xs transition-all duration-300 w-8 py-1  mx-4px sm:(py-2) hover:(opacity-100) opacity-80  rounded-xl;
}
.chroma-key.active {
  @apply text-light-100 font-bold;
}
</style>