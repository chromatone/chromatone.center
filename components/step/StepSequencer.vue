<script setup>
import { noteColor } from "#/use/colors"
import { Scale, Midi, Note } from 'tonal'
import { onKeyStroke, useStorage } from '@vueuse/core'
import { notes } from '#/use/theory'
import { globalScale } from '#/use/chroma'
import { Pattern, start, getTransport, getDraw } from 'tone'
import { synthOnce } from '#/use/synth'
import { midiOnce } from '#/use/midi'
import { pianoOnce, init } from '#/use/piano'
import { tempo } from '#/use/tempo'
import { useData } from 'vitepress'
const { isDark } = useData()
import { computed, onBeforeUnmount, onMounted, reactive, watch, watchEffect } from 'vue'

const Draw = getDraw()
const Transport = getTransport()

const state = reactive({
  started: false,
  playing: false,
  hover: false,
  mounted: false,
  current: 0,
  octave: useStorage('seq-octave', 3),
  bpm: useStorage('seq-bpm', 120),
  steps: useStorage('seq-steps', 16),
  type: useStorage('seq-type', 'up'),
  probability: useStorage('seq-prob', 1),
  humanize: useStorage('seq-human', false),
  interval: useStorage('seq-interval', '8n'),
  note: computed(() => notes[globalScale.tonic]),
  range: computed(() => Scale.rangeOf(state.note + state.octave + ' ' + globalScale.set.name)(state.note + state.octave, state.note + (state.octave + 2)).map(note => Note.simplify(note)).reverse()),
  midi: computed(() => state.range.map(note => Midi.toMidi(note))),
  pitches: computed(() => state.midi.map(note => (note + 3) % 12)),
  progress: 0
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


watch(() => state.steps, () => {
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
        positions[index] = cell?.cell
        if (cell?.active) {
          midiOnce(cell?.note)
        }
      }, time)
      if (cell?.active) {
        synthOnce(cell.note, state.interval, time)
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
    patterns.forEach(p => { p.start(0) })
    Transport.start()
    if (!state.started) {
      start()
      state.started = true
    }
  } else {
    patterns.forEach(p => { p.stop() })
    Transport.stop()
  }
});

watch(() => state.type, type => {
  patterns.forEach(p => {
    p.pattern = type
  })
}, { immediate: true })

watch(() => state.probability, prob => {
  patterns.forEach(p => {
    p.probability = prob
  })
}, { immediate: true })

watch(() => state.humanize, hum => {
  patterns.forEach(p => {
    p.humanize = hum
  })
}, { immediate: true })

function reset() {
  state.playing = false
  setPatterns()
}

onBeforeUnmount(() => {
  patterns.forEach(p => {
    p.stop(0)
    p.dispose()
  })
});

function borderColor(cell, r) {
  return cell.active ? noteColor(state.pitches[r]) : cell.cell == positions[r] ? isDark.value ? '#eee7' : '#3337' : '#4444'
}

</script>

<template lang="pug">
.flex.flex-col

  .rows(
    @mousedown="state.hover = true"
    @mouseleave.self="state.hover = false"
    @mouseup="state.hover = false"
    )
    .row
      .title
    .row(
      v-for="(row, r) in rows" 
      :key="row")
      .title.m-1.rounded-md.shadow(:style="{ color: noteColor(state.pitches[r]), backgroundColor: state.range[r].length > 2 ? '#0005' : '#aaa5' }") {{ state.range[r] }}
      .cell(
        v-for="(cell, c) in row" 
        :id="`c${r}-${c}`" 
        :key="cell"
        :style="{ color: noteColor(state.pitches[r]), borderColor: borderColor(cell, r),backgroundColor: cell.cell == positions[r] ? cell.active ? noteColor(state.pitches[r], 3) : isDark ? '#0005' : '#fff5' : 'transparent', marginRight: c % 4 == 3 ? '12px' : '1px' }"
        :class="{ active: cell?.active, current: cell.cell == positions[r] }"
        @mousedown.prevent="toggle(r, c, true, $event)"
        @mouseenter="toggle(r, c, false, $event)"
        )
        .dot(
          :style="{ backgroundColor: cell.active ? noteColor(state.pitches[r]) : cell.cell == positions[r] ? 'currentColor' : '#4448' }"
        )
  .flex.flex-wrap.items-center.justify-center.mx-2.gap-2
    control-scale(style="flex: 1 1 100px" v-tooltip.top="'Select root note and scale'")
    .flex.flex-wrap.items-center.justify-center.bg-light-900.p-4.rounded-2xl.dark-bg-dark-800.gap-2(style="flex: 5 1 200px")

      select(
        v-model="state.type" 
        v-tooltip.top="'Pattern type'")
        option(
          v-for="(type) in patternTypes" 
          :key="type" 
          :value="type"
          ) {{ type }}
      .is-group.flex.flex-wrap.p-2
        control-rotary(
          v-model="state.octave" 
          v-tooltip.top="'Octave'"
          :max="4" 
          :min="2" 
          :fixed="0" 
          param="OCTAVE" 
          )
        control-rotary(
          v-model="state.steps" 
          v-tooltip.top="'Number of steps'"
          :max="32" 
          :min="4" 
          :step="1" 
          :fixed="0" 
          param="steps" 
          )
        control-rotary(
          v-model="state.probability" 
          v-tooltip.top="'Probability'"
          :max="1" 
          :min="0" 
          :step="0.01" 
          :fixed="2" 
          param="prob" 
          )
        control-rotary(
          v-model="tempo.bpm" 
          v-tooltip.top="'Set tempo'"
          :step="1" 
          :max="400" 
          :min="10" 
          :fixed="0" 
          param="BPM"
          )
      .is-group.flex.items-center
        button.text-button(
          v-tooltip.bottom="'Humanize rhythm'"
          :class="{ active: state.humanize }" 
          @click="state.humanize = !state.humanize" 
          ) HMN
        button.text-button(
          v-tooltip.bottom="'Clear pattern'" 
          @click="clear()")
          .i-la-trash-alt
      .is-group.flex.items-center
        button.text-button(
          v-if="!state.playing" 
          v-tooltip.bottom="'Play'" 
          @click="state.playing = true")
          .i-la-play
        button.text-button(
          v-if="state.playing" 
          v-tooltip.bottom="'Pause'" 
          @click="state.playing = false")
          .i-la-pause
        button.text-button(
          v-tooltip.bottom="'Stop'" 
          @click="reset()")
          .i-la-stop
  
</template>

<style lang="postcss" scoped>
.rows {
  @apply my-4 mx-2 cursor-pointer select-none bg-light-900 rounded-xl overflow-hidden shadow-lg dark-bg-dark-700 dark-border-1 dark-border-opacity-10;
}

.row {
  @apply flex w-full;
}

.title {
  @apply pr-2 text-right text-sm bg-dark-50 bg-opacity-40 dark-bg-dark-800 flex items-center justify-end;
  flex: 0 0 52px;
}

.cell {
  @apply flex items-center justify-center py-2 text-center m-1px rounded-xl transition-all duration-200 ease-out box-border h-10;
  transition: all 200ms ease-out;
  flex: 1 1 20px;
}

.cell.active .dot {
  transform: scale(4);
}

.cell:hover {
  @apply !bg-dark-100 !dark-bg-dark-900;
}

.cell.current .dot {
  transform: scale(1.1);
}

.cell:hover .dot {
  background-color: currentColor !important;
  transform: scale(6);
}

.cell.current.active .dot {
  transform: scale(8);
}

.cell.active.current {
  @apply scale-110;
}

.dot {
  @apply bg-light-100 rounded-full w-1 h-1;
  transition: all 200ms ease-out;
}

select {
  @apply p-2 mx-2 rounded dark-bg-dark-100;
}
</style>