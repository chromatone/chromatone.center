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
    sqnob.w-50px(v-model="state.bpm" :max="400" :min="10" :fixed="0" param="BPM")
    button(@click="state.playing = true" v-if="!state.playing")
      la-play
    button(@click="state.playing = false" v-if="state.playing")
      la-pause
    .p-2 {{ state.current }}
  .rows(
    @mousedown="state.hover = true"
    @mouseleave.self="state.hover = false"
    @mouseup="state.hover = false"
    )
    .row
      .title
    .row(v-for="(row,r) in rows" :key="row")
      .title(:style="{ color: pitchColor(state.pitches[r]) }") {{ state.range[r] }}
      .cell(
        v-for="(cell,c) in row" :key="cell" 
        :id="`c${r}-${c}`"
        :style=`{
          borderColor: pitchColor(state.pitches[r]),
          backgroundColor: cell.active ? pitchColor(state.pitches[r]) : 'transparent',
          marginRight: c % 4 == 3 ? '4px' : '1px'
        }`
        :class="{ active: cell?.active }"
        @mousedown.prevent="toggle(r, c, true, $event)"
        @mouseenter="toggle(r, c, false, $event)"
        )
</template>

<script setup>
import { notes, pitchColor } from 'chromatone-theory'
import { Scale, ScaleType, Midi } from '@tonaljs/tonal'
import { useStorage, useRafFn } from '@vueuse/core'
import { Pattern, Transport } from 'tone'
const scales = ScaleType.all();
const state = reactive({
  playing: false,
  hover: false,
  mounted: false,
  current: 0,
  tonic: useStorage('seq-tonic', 0),
  octave: useStorage('seq-octave', 4),
  bpm: useStorage('seq-bpm', 120),
  steps: useStorage('seq-steps', 16),
  setNum: useStorage('seq-scale', 2708),
  note: computed(() => notes[state.tonic].name),
  scale: computed(() => ScaleType.get(state.setNum)),
  range: computed(() => Scale.rangeOf(state.note + state.octave + ' ' + state.scale.name)(state.note + state.octave, state.note + (state.octave + 2)).reverse()),
  midi: computed(() => state.range.map(note => Midi.toMidi(note))),
  pitches: computed(() => state.midi.map(note => (note + 3) % 12)),
  stepCount: computed(() => [...Array(state.steps).keys()])
});

const rows = reactive([])
let patterns = []

watchEffect(() => {
  state.range.forEach((note, index) => {
    rows[index] = rows[index] || []
    rows[index].length = state.steps
    rows.length = state.range.length

    let fullRow = Array.apply(null, rows[index])
    fullRow.forEach((cell, c) => {
      rows[index][c] = {
        row: index,
        cell: c,
        note: note,
        active: cell?.active || false,
      }
    })
  })
});

onMounted(() => {
  state.mounted = true
  setPatterns()
})

watch(
  () => state.bpm,
  (bpm) => Transport.bpm.rampTo(bpm, '4n'),
)

watch(() => rows.length, len => {
  if (state.mounted) {
    setPatterns()
  }
}, { immediate: true })

function setPatterns() {
  patterns.forEach(p => {
    p.stop(0)
    p.dispose()
  })
  patterns = []
  rows.forEach((row, index) => {
    patterns[index] = new Pattern((time, cell) => {
      if (index == 0) {
        state.current = cell.cell
      }
      if (cell.active) {
        console.log(cell.note, cell.cell)
      }
    }, rows[index], 'up').start(0);
    patterns[index].interval = '16n'
  })
}

let currentCell
function toggle(row, cell, sure, event) {
  if (!state.hover && !sure) return
  if (!sure && currentCell == event.target.id) return
  currentCell = event.target.id
  if (rows[row][cell].active) {
    rows[row][cell].active = false
  } else {
    rows[row][cell].active = true
  }
}

function clear() {
  rows.forEach((row, r) => {
    row.forEach((cell, c) => rows[r][c] = null)
  })
}

watch(() => state.playing, play => {
  if (play) {
    Transport.start()
  } else {
    Transport.stop()
  }
});

onBeforeUnmount(() => {
  patterns.forEach(p => {
    p.stop(0)
    p.dispose()
  })
})

const patternsTypes = ['up', 'down', 'upDown', 'downUp', 'alternateUp', 'alternateDown', 'random', 'randomWalk', 'randomOnce'];
</script>

<style scoped>
.rows {
  @apply my-4 mx-2 cursor-pointer select-none;
}
.row {
  @apply flex w-full;
}
.title {
  @apply px-1;
  flex: 0 0 52px;
}
.cell {
  @apply p-2 border-1 m-1px rounded;
  flex: 1 1 20px;
  &.active {
    @apply bg-current;
  }
  &.current {
    @apply border-2;
  }
}

button {
  @apply p-2 border-1 text-center flex flex-col justify-center m-1 rounded border-current;
}
</style>