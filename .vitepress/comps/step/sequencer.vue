<template lang="pug">
.flex.flex-col
  control-scale.py-4
  .flex.flex-wrap.justify-center
    control-knob.w-70px(v-model="state.octave" :max="4" :min="2" :fixed="0" param="OCTAVE")
    select(v-model="state.type")
      option(
        v-for="(type) in patternTypes" 
        :key="type" :value="type"
        ) {{ type }}
    control-knob.w-50px(
      v-model="state.steps" :max="32" :min="4" :step="1" :fixed="0" param="steps")
    control-knob.w-50px(v-model="state.bpm" :step="1" :max="400" :min="10" :fixed="0" param="BPM")
    control-knob.w-50px(v-model="state.probability" :max="1" :min="0" :step="0.01" :fixed="2" param="prob")
    button(:class="{ active: state.humanize }" @click="state.humanize = !state.humanize") HMN
    button(@click="clear()")
      la-trash-alt
    button(@click="state.playing = true" v-if="!state.playing")
      la-play
    button(@click="state.playing = false" v-if="state.playing")
      la-pause
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
          color: pitchColor(state.pitches[r]),
          borderColor: cell.active ? pitchColor(state.pitches[r]) : cell.cell == positions[r] ? '#4449' : '#4442',
          backgroundColor: cell.cell == positions[r] && cell.active ? pitchColor(state.pitches[r], 3) : 'transparent',
          marginRight: c % 4 == 3 ? '4px' : '1px'
        }`
        :class="{ active: cell?.active, current: cell.cell == positions[r] }"
        @mousedown.prevent="toggle(r, c, true, $event)"
        @mouseenter="toggle(r, c, false, $event)"
        ) •
</template>

<script setup>
import { notes, pitchColor } from '@theory'
import { Scale, ScaleType, Midi, Note } from '@tonaljs/tonal'
import { useRafFn, onKeyStroke } from '@vueuse/core'
import { scaleList } from '@use/theory'
import { globalScale } from '@use/chroma'
import { Pattern, start, Transport, Draw } from 'tone'
import { synthOnce } from '@use/synth.js'
import { midiOnce } from '@use/midi.js'
import { pianoOnce, init } from '@use/piano'
const state = reactive({
  started: false,
  playing: false,
  hover_ false,
  mounted: false,
  current: 0,
  octave: useStorage('seq-octave', 3),
  bpm: useStorage('seq-bpm', 120),
  steps: useStorage('seq-steps', 16),
  type: useStorage('seq-type', 'up'),
  probability: useStorage('seq-prob', 1),
  humanize: useStorage('seq-human', false),
  interval: useStorage('seq-interval', '8n'),
  note: computed(() => notes[globalScale.tonic].name),
  range: computed(() => Scale.rangeOf(state.note + state.octave + ' ' + globalScale.set.name)(state.note + state.octave, state.note + (state.octave + 2)).map(note => Note.simplify(note)).reverse()),
  midi: computed(() => state.range.map(note => Midi.toMidi(note))),
  pitches: computed(() => state.midi.map(note => (note + 3) % 12)),
});

const patternTypes = ['up', 'down', 'upDown', 'downUp', 'alternateUp', 'alternateDown', 'random', 'randomWalk', 'randomOnce'];

const rows = reactive([])
const positions = reactive([])
let patterns = []

onKeyStroke(' ', (e) => {
  e.preventDefault()
  state.playing = !state.playing
})

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
  init()
  setPatterns()
})

watch(
  () => state.bpm,
  (bpm) => Transport.bpm.rampTo(bpm, state.interval),
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
      Draw.schedule(() => {
        positions[index] = cell.cell
        if (cell.active) {
          midiOnce(cell.note)
        }
      }, time)
      if (cell.active) {
        // synthOnce(cell.note, state.interval, time)
        pianoOnce(cell.note, state.interval, time)
      }
    }, rows[index], state.type).start(0);
    patterns[index].interval = state.interval
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
    row.forEach((cell, c) => rows[r][c].active = false)
  })
}

watch(() => state.playing, play => {
  if (play) {
    Transport.start()
    if (!state.started) {
      start()
      state.started = true
    }
  } else {
    Transport.stop()
  }
});

watch(() => state.type, type => {
  patterns.forEach(p => {
    p.pattern = type
  })
})

watch(() => state.probability, prob => {
  patterns.forEach(p => {
    p.probability = prob
  })
})

watch(() => state.humanize, hum => {
  patterns.forEach(p => {
    p.humanize = hum
  })
})

onBeforeUnmount(() => {
  patterns.forEach(p => {
    p.stop(0)
    p.dispose()
  })
});
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
  @apply p-1 text-center border-3 m-1px rounded-lg transition-all duration-100 ease-in-out box-border;
  flex: 1 1 20px;
  &.active {
    @apply bg-current;
  }
  &.current {
    @apply;
  }
  &.active.current {
    @apply scale-110 transform;
  }
}
select {
  @apply p-2 mx-2 rounded;
}
button {
  @apply p-2 border-1 text-center flex flex-col justify-center m-1 rounded border-current;
  &.active {
    @apply bg-light-100 dark_bg-dark-100;
  }
}
</style>