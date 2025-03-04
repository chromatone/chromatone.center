<script setup>
import { rotateArray } from '#/use/calculations'
import { chromaColorMix, noteColor } from "#/use/colors";
import { Note, Pcset, Interval, ChordType, ScaleType } from 'tonal'
import { Frequency } from 'tone'
import { notes } from '#/use/theory'
import { playChroma, stopChroma } from '#/use/chroma'
import { globalScale } from '#/use/global'
import { calcBg } from '#/use/colors'
import { colord } from 'colord'
import { reactive, computed } from 'vue'
import { playNoteOnce, tempo } from '#/use';

const emit = defineEmits(['update:chroma'])
const props = defineProps({
  chroma: { type: String, default: '' },
  twoRow: { type: Boolean, default: true, },
  editable: { type: Boolean, default: false, }
});

const state = reactive({
  minor: "101101011010",
  chord: computed(() => ChordType.get(props.chroma)),
  scale: computed(() => ScaleType.get(props.chroma)),
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
    playNoteOnce(i + globalScale?.tonic + 57)
  }
}

function toggleStep(i) {
  if (!props.editable || i == 0) return
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
  let chOct = rotateArray(allNotes, -globalScale?.tonic).map((n, i) => Frequency(n.pitch + globalScale?.tonic + 57, 'midi').toNote()
  )
  let filtered = chOct.filter((val, i) => {
    if (shiftChroma[i] == '1') {
      return true
    }
  })
  return Note.sortedNames(filtered)
})



function arpeggiate(octave = false) {
  let playedNotes = [...chordNotes.value]
  if (octave) {
    playedNotes.push(globalScale?.tonic + 57 + 12)
    let back = [...chordNotes.value].reverse()
    playedNotes = [...playedNotes, ...back]
  }
  playedNotes.forEach((note, i) => {

    setTimeout(() => {
      playNoteOnce(note)
    }, i * 1000 / (2 * tempo.bpm / 60))
  })
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
    .flex.flex-wrap.items-center.justify-between.p-2.gap-2(
      :class="{ 'w-full': true }"
      ) 

      button.text-button.text-white.font-bold.text-md.flex.gap-1(
        :style="{ backgroundColor: chromaColorMix(chroma, globalScale?.tonic).hsl }"
        @pointerdown.prevent.stop="playChroma(chroma)"
        @pointerout="stopChroma(chroma)"
        @pointerup="stopChroma(chroma)"
        @pointerleave="stopChroma(chroma)"
      ) 
        span.mr-1 {{ globalScale?.note.name }}{{ state.chord.aliases[0] || ' ' + state.scale.name }}

      .flex-1
        slot
      button.text-sm.flex.items-center.gap-1.border-2.p-2.rounded-xl(
        :style="{ borderColor: chromaColorMix(chroma, globalScale?.tonic).hsl }"
        v-if="state.chord.name || state.chord.aliases[0]" 
        @click="arpeggiate()"
        )  
          .i-la-play
          .font-bold.-mt-2px {{ globalScale?.note.name }} {{ state.chord.name || state.chord.aliases[0] }} 
      button.text-button.text-sm.flex.items-center(
        :style="{ borderColor: chromaColorMix(chroma, globalScale?.tonic).hsl }"
        v-if="state.scale.name"  
        @click="arpeggiate(true)") 
        .i-la-play.-mt-1.mr-1
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
  @apply cursor-pointer transition-all duration-300 py-1 hover-(opacity-100) opacity-70 rounded flex justify-center px-1;
  flex: 1 1 12px;
  box-shadow: 0 2px 0px rgba(0, 0, 0, 0.4);
}

.chroma-key.active {
  @apply text-light-100 font-bold opacity-90;
  box-shadow: 0 2px 0px rgba(0, 0, 0, 0.6);
}
</style>