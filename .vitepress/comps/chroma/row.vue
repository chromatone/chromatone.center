<template lang="pug">
.flex.flex-col.items-start.border-2.px-2.pb-2.pt-1.rounded-xl.w-full.relative(
  :style="{ borderColor: pitchColor(globalScale.tonic, 2), backgroundColor: pitchColor(globalScale.tonic, 2, 1, 0.05) }"
)
  .flex.flex-wrap.items-center.my-2(
    :class="{ 'w-full': true }"
    ) 
    button.text-button.text-white.font-bold(
      :style="{ backgroundColor: chromaColorMix(chroma, globalScale.tonic).hsl }"
      @mousedown="playChroma(chroma)"
      @touchstart.prevent.stop="playChroma(chroma)"
      @touchend="stopChroma(chroma)"
      @touchcancel="stopChroma(chroma)"
      @mouseup="stopChroma(chroma)"
      @mouseleave="stopChroma(chroma)"
    ) {{ notes[globalScale.tonic].name }}{{ state.chord.aliases[0] }} &nbsp;
    button.text-button(
      :style="{ borderColor: chromaColorMix(chroma, globalScale.tonic).hsl }"
      v-if="state.chord.name" 
      @click="arpeggiate()"
      )  {{ state.chord.name }} 
    button.text-button(
      :style="{ borderColor: chromaColorMix(chroma, globalScale.tonic).hsl }"
      v-if="state.scale.name"  
      @click="arpeggiate(true)") {{ state.scale.name }} scale
    .flex-1
    .px-2.py-1.text-sm.absolute.top-2.right-2 
  .flex.justify-stretch.mb-2.mx-auto.w-full
    .chroma-key(
      @mouseenter="hover(i, bit)"
      @touchstart="hover(i, bit)"
      v-for="(bit,i) in chroma.split('')"
      :key="i"
      @click="toggleStep(i)"
      :class="{ active: bit == 1 }"
      :style="{ backgroundColor: calcBg(i, bit), marginLeft: (i == 1 || i == 3 || i == 5 || i == 8 || i == 10) ? '12px' : '0px' }"
      ) {{ bit == 1 ? notes[(i + globalScale.tonic) % 12].name : intervals[i] }}
  .flex.flex-wrap.items-center.justify-stretch.w-full.px-2.text-sm
    .flex.font-bold(title="Intervals")
      .p-2px {{ state.intervals.length }}:
      .p-2px(v-for="interval in state.intervals" :key="interval") {{ interval }}
    .flex-1
    .flex(title="Steps")
      .p-2px(v-for="(semitone,s) in state.semitones" :key="s") {{ semitone }}
    .flex-1
    .p-1(title="Pcset number") # {{ state.num }}
</template>

<script setup>
import { pitchColor, notes, rotateArray } from 'chromatone-theory'
import { chromaColorMix } from "@use/colors.js";
import { Note, Pcset, Interval } from '@tonaljs/tonal'
import { Frequency } from 'tone'
import { synthOnce } from '@use/synth.js'
import { midiOnce } from '@use/midi.js'
import { globalScale, chordType, scaleType, playChroma, stopChroma, intervals } from '@use/theory.js'

const emit = defineEmits(['update:chroma'])
const props = defineProps({
  chroma: {
    type: String,
  },
  twoRow: {
    type: Boolean,
    default: true,
  }
});

const state = reactive({
  minor: "101101011010",
  chord: computed(() => chordType.get(props.chroma)),
  scale: computed(() => scaleType.get(props.chroma)),
  num: computed(() => Pcset.num(props.chroma)),
  intervals: computed(() => Pcset.intervals(props.chroma)),
  semitones: computed(() => {
    let arr = []
    if (!state.intervals) return []
    for (let i = 1; i < state.intervals.length; i++) {
      arr[i - 1] = (Interval.semitones(state.intervals[i]) - Interval.semitones(state.intervals[i - 1]))
    }
    return arr
  })
})

function hover(i, bit) {
  if (bit == 1) {
    playNote(i + globalScale.tonic)
  }
}

function toggleStep(i) {
  let chroma = [...props.chroma.split('')]
  if (chroma[i] == '1') {
    chroma[i] = '0'
  } else {
    chroma[i] = '1'
  }
  emit('update:chroma', chroma.join(''))
}

function calcBg(i, bit, hover) {
  if (bit == 1) {
    return pitchColor((i + globalScale.tonic) % 12, 3)
  } else if (state.minor[(i + globalScale.tonic) % 12] == '1') {
    return 'hsla(0,0%,80%,0.3)'
  } else {
    return 'hsla(0,0%,20%,0.3)'
  }
}

const chordNotes = computed(() => {
  let shiftChroma = rotateArray(props.chroma.split(''), -globalScale.tonic)
  let chOct = rotateArray(notes, -globalScale.tonic).map((n, i) => {
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
  chordNotes.value.forEach((name) => {
    midiOnce(name)
  })
  synthOnce(chordNotes.value, '4n')
}

function arpeggiate(octave = false) {
  let playedNotes = [...chordNotes.value]
  if (octave) {
    playedNotes.push(Frequency(globalScale.tonic + 57 + 12, 'midi').toNote())
  }
  playedNotes.forEach((note, i) => {
    synthOnce(note, '8n', `+${i / 3}`)
    midiOnce(note, { time: `+${i / 3}` })
  })
}

function playNote(note = 0, octave = 0) {
  let freq = Frequency(note + 57, 'midi')
  midiOnce(freq.toNote())
  synthOnce(freq.toNote())
}

</script>

<style  scoped>
.chroma-key {
  @apply grid cursor-pointer place-content-center text-xs transition-all duration-300 py-2   hover:(opacity-100) opacity-70  rounded-xl;
  flex: 1 1 8%;
  box-shadow: 0 2px 0px rgba(0, 0, 0, 0.4);
}
.chroma-key.active {
  @apply text-light-100 font-bold opacity-90;
  box-shadow: 0 2px 0px rgba(0, 0, 0, 0.6);
}
</style>