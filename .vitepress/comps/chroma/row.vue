<script setup>
import { rotateArray } from '#/use/calculations'
import { chromaColorMix, noteColor } from "#/use/colors.js";
import { Note, Pcset, Interval } from '@tonaljs/tonal'
import { Frequency } from 'tone'
import { synthOnce } from '#/use/synth.js'
import { midiOnce } from '#/use/midi.js'
import { chordType, scaleType, intervals, notes } from '#/use/theory'
import { globalScale, playChroma, stopChroma, } from '#/use/chroma'
import { calcBg } from '#/use/colors'
import { colord } from 'colord'

const emit = defineEmits(['update:chroma'])
const props = defineProps({
  chroma: { type: String, },
  twoRow: { type: Boolean, default: true, },
  editable: { type: Boolean, default: false, }
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
    playNote(i + globalScale?.tonic)
  }
}

function toggleStep(i) {
  if (!props.editable) return
  let chroma = [...props.chroma.split('')]
  if (chroma[i] == '1') {
    chroma[i] = '0'
  } else {
    chroma[i] = '1'
  }

  emit('update:chroma', chroma.join(''))
}


const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i }))

const chordNotes = computed(() => {
  let shiftChroma = rotateArray(props.chroma.split(''), -globalScale?.tonic)
  let chOct = rotateArray(allNotes, -globalScale?.tonic).map((n, i) => {
    return Frequency(n.pitch + globalScale?.tonic + 57, 'midi').toNote()
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
    playedNotes.push(Frequency(globalScale?.tonic + 57 + 12, 'midi').toNote())
    let back = [...chordNotes.value].reverse()
    playedNotes = [...playedNotes, ...back]
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

<template lang="pug">
.flex.w-full.rounded-xl.overflow-hidden
  .w-3.flex.flex-col.items-center.text-white.text-opacity-90(:style="{ backgroundColor: chromaColorMix(chroma, globalScale?.tonic).hsl }")

  .flex.flex-col.items-start.w-full.relative.shadow-lg(
    :style="{ backgroundColor: colord(chromaColorMix(chroma, globalScale?.tonic).hsl).alpha(0.1).toHex() }"
    )
    .flex.flex-wrap.items-center.justify-stretch.w-full.text-sm.px-2.bg-dark-800.bg-opacity-10
      .p-2px {{ chroma }}
      .flex-1
      .flex.font-bold(title="Intervals")
        .p-2px(v-for="interval in state.intervals" :key="interval") {{ interval }}
      .flex-1
      .flex(title="Steps")
        span(v-for="(semitone, s) in state.semitones" :key="s") {{ s != 0 ? '-' : '' }}{{ semitone }}
      .flex-1

      .p-1(title="Pcset number") # {{ state.num }}
    .flex.flex-wrap.items-center.justify-between.p-2(
      :class="{ 'w-full': true }"
      ) 

      button.text-button.text-white.font-bold.text-md.flex.gap-1(
        :style="{ backgroundColor: chromaColorMix(chroma, globalScale?.tonic).hsl }"
        @mousedown="playChroma(chroma)"
        @touchstart.prevent.stop="playChroma(chroma)"
        @touchend="stopChroma(chroma)"
        @touchcancel="stopChroma(chroma)"
        @mouseup="stopChroma(chroma)"
        @mouseleave="stopChroma(chroma)"
      ) 
        span.mr-1 {{ globalScale?.note.name }}{{ state.chord.aliases[0] || ' ' + state.scale.name }}
      chroma-code(:chroma="chroma")
      .flex-1
      button.text-button.text-sm(
        :style="{ borderColor: chromaColorMix(chroma, globalScale?.tonic).hsl }"
        v-if="state.chord.name || state.chord.aliases[0]" 
        @click="arpeggiate()"
        )  
          la-play.-mt-1.mr-1
          span {{ globalScale?.note.name }} {{ state.chord.name || state.chord.aliases[0] }} 
      button.text-button.text-sm(
        :style="{ borderColor: chromaColorMix(chroma, globalScale?.tonic).hsl }"
        v-if="state.scale.name"  
        @click="arpeggiate(true)") 
        la-play.-mt-1.mr-1
        span {{ globalScale?.note.name }} {{ state.scale.name }} scale
    .flex.justify-stretch.mx-auto.w-full.p-2
      .chroma-key.text-xs(
        @mouseenter="hover(i, bit)"
        @touchstart="hover(i, bit)"
        v-for="(bit, i) in chroma"
        :key="i"
        @click="toggleStep(i)"
        :class="{ active: bit == 1 }"
        :style="{ backgroundColor: calcBg(i, bit), marginLeft: (i == 1 || i == 3 || i == 5 || i == 7 || i == 8 || i == 10) ? '12px' : '2px' }"
        ) {{ bit == 1 ? notes[(i + globalScale?.tonic) % 12] : '' }}
</template>



<style lang="postcss" scoped>
.chroma-key {
  @apply cursor-pointer transition-all duration-300 py-1 hover_(opacity-100) opacity-70 rounded flex justify-center px-1;
  flex: 1 1 12px;
  box-shadow: 0 2px 0px rgba(0, 0, 0, 0.4);
}

.chroma-key.active {
  @apply text-light-100 font-bold opacity-90;
  box-shadow: 0 2px 0px rgba(0, 0, 0, 0.6);
}
</style>