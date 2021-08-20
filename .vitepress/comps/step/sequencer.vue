<template lang="pug">
.flex.flex-col
  .flex.flex-wrap
    piano-keys(v-model:pitch="state.tonic")
    sqnob.w-70px(v-model="state.octave" :max="4" :min="1" :fixed="0" param="OCTAVE")
    select(v-model="state.setNum")
      option(v-for="scale in scales" :key="scale.setNum" :value="scale.setNum") {{ scale.name }}
    button(@click="clear()")
      la-trash-alt
    sqnob.w-50px(v-model="state.steps" :max="32" :min="4" :fixed="0" param="steps")
    sqnob.w-50px(v-model="state.tempo" :max="400" :min="10" :fixed="0" param="BPM")
    button(@click="state.playing = true" v-if="!state.playing")
      la-play
    button(@click="state.playing = false" v-if="state.playing")
      la-pause
    .p-2 {{ state.hover }}
  .sequencer(
    @mousedown="state.hover = true"
    @mouseleave.self="state.hover = false"
    @mouseup="state.hover = false"
    )
    .row(v-for="(row,r) in sequencer" :key="row")
      .title(:style="{ color: pitchColor(state.pitches[r]) }") {{ state.range[r] }}
      .cell(
        v-for="(cell,c) in row" :key="cell" 
        :id="`c${r}-${c}`"
        :style="{ borderColor: pitchColor(state.pitches[r]), backgroundColor: cell ? pitchColor(state.pitches[r]) : 'transparent' }"
        :class="{ active: cell }"
        @mousedown="toggle(r, c, true, $event)"
        @mouseenter="toggle(r, c, false, $event)"
        )
</template>

<script setup>
import { notes, pitchColor } from 'chromatone-theory'
import { Scale, ScaleType, Midi } from '@tonaljs/tonal'
import { useStorage } from '@vueuse/core'
const scales = ScaleType.all();
const state = reactive({
  playing: false,
  hover: false,
  tonic: useStorage('seq-tonic', 0),
  octave: useStorage('seq-octave', 4),
  tempo: useStorage('seq-tempo', 120),
  steps: useStorage('seq-steps', 16),
  setNum: useStorage('seq-scale', 2708),
  note: computed(() => notes[state.tonic].name),
  scale: computed(() => ScaleType.get(state.setNum)),
  range: computed(() => Scale.rangeOf(state.note + state.octave + ' ' + state.scale.name)(state.note + state.octave, state.note + (state.octave + 2)).reverse()),
  midi: computed(() => state.range.map(note => Midi.toMidi(note))),
  pitches: computed(() => state.midi.map(note => (note + 3) % 12)),
});

const sequencer = reactive([])

watchEffect(() => {
  for (let note in state.range) {
    sequencer[note] = sequencer[note] || []
    sequencer[note].length = state.steps
    sequencer.length = state.range.length
  }
});

let currentCell
function toggle(row, cell, sure, event) {
  if (!state.hover && !sure) return
  if (currentCell == event.target.id) return
  currentCell = event.target.id
  sequencer[row][cell] = !sequencer[row][cell]
}

function clear() {
  sequencer.forEach((row, r) => {
    row.forEach((cell, c) => sequencer[r][c] = null)
  })
}
</script>

<style scoped>
.sequencer {
  @apply my-4 mx-2 cursor-pointer select-none;
}
.row {
  @apply flex w-full;
}
.title {
  @apply px-1;
  flex: 0 0 45px;
}
.cell {
  @apply p-2 border-1 m-1px rounded;
  flex: 1 1 20px;
  &.active {
    @apply bg-current;
  }
}

button {
  @apply p-2 border-1 text-center flex flex-col justify-center m-1 rounded border-current;
}
</style>