<script setup>
import { midiColor, playNoteOnce, useTempo } from '#/use';
import { Note } from 'tonal';
import { watch, ref, computed, reactive } from 'vue';

const tempo = useTempo()

const bar = 1
const octave = 3

const getRotation = (ticks = 0, ratio = 1) => ((ticks / (192 * bar * ratio)) % 1) * 360;

const ratios = reactive([1, 2, 3, 4, 5, 6])

const intervals = reactive(['1P', '8P', '5P', '4P', '3M', '9M'])

const notes = computed(() => intervals.map(interval => Note.transpose(tempo.note + octave, interval)))

const colors = computed(() => notes.value.map(note => midiColor(Note.midi(note))))

const PPQN = 192 // Pulses Per Quarter Note
const BAR = PPQN * bar // One full bar in pulses
const lastCycles = ref({})
let lastTicks = 0
let isFirstStart = true

watch(() => tempo.ticks, ticks => {
  // Reset case
  if (ticks < lastTicks) {
    lastCycles.value = {}
    isFirstStart = true
    lastTicks = ticks
    return
  }

  // Initial start after reset
  if (ticks === 1 && isFirstStart) {
    isFirstStart = false
    lastCycles.value = {}
    ratios.forEach((r, i) => playNoteOnce(Note.transpose(tempo.note + octave, intervals[i])))
  } else if (ticks > 0) { // Normal cycle processing
    ratios.forEach((r, i) => {
      const cycleTicks = BAR * r
      const currentCycle = Math.floor(ticks / cycleTicks)
      const cyclePhase = (ticks % cycleTicks) / cycleTicks
      const isNewCycle = currentCycle > (lastCycles.value[r] ?? -1) && cyclePhase < 0.1

      if (isNewCycle) {
        lastCycles.value[r] = currentCycle
        playNoteOnce(Note.transpose(tempo.note + octave, intervals[i]))
      }
    })
  }

  lastTicks = ticks
})

</script>

<template lang='pug'>
svg.max-h-100vh(version="1.1" baseProfile="full" :viewBox="`0 0 500 500`" xmlns="http://www.w3.org/2000/svg")
  g(v-for="(ratio, r) in ratios.toReversed()" :key="ratio"
    :transform="`translate(250, 250) rotate(${getRotation(tempo.ticks, ratio)}) `")
    circle(:r="20 + ratio * 20" fill="#3333" stroke="black" stroke-width="1")
    g(
      v-for="(_, mark) in ratio" :key="mark"
      :transform="`rotate(${360 * mark / ratio}) `")
      line(
        :y2="-20 - ratio * 20" 
        :stroke-width="mark == 0 ? 2 : 1"
        :stroke="mark == 0 ? colors.toReversed()[r] : '#aaa3'" 
        )
      circle(
        :r="mark == 0 ? 4 : 2" :fill="colors.toReversed()[r]" :cy="-20 - ratio * 20 + 3" 
        )
  line(transform="translate(250 0)" y1="30" y2="250" stroke="white" opacity=".2")
  circle(r="3" fill="#aaa" :transform="`translate(250, 250) `")
</template>