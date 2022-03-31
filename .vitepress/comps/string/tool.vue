<script setup>
import { useStorage } from '@vueuse/core'
import { Note, Interval, Chord } from '@tonaljs/tonal'
import { freqColor } from '@use/calculations'
import { colord } from 'colord'
import { synthOnce } from '@use/synth.js'
import { midiOnce } from '@use/midi.js'

const props = defineProps({
  instruments: Object,
})

const instrument = useStorage('instrument-calc', {
  l: 430,
  frets: 27,
  title: 'Ukulele',
  tuning: ['C4', 'G4', 'E4', 'A4'],
});

const tab = reactive([])

const chord = computed(() => {
  return Chord.detect(tab)
})

function selectNote(note, num, string) {
  midiOnce(note);
  synthOnce(note)
  tab[string] = note
}

watch(() => instrument.value.title, title => {
  const inst = props.instruments[title]
  instrument.value.l = inst.l
  instrument.value.frets = inst.frets
  instrument.value.tuning = inst.tuning
})

const inlays = computed(() => {
  return [3, 5, 7, 9, 12, 15, 17, 19, 21].filter(el => el < instrument.value.frets)
})

const octaves = computed(() => {
  return [12, 24].filter(el => el < instrument.value.frets)
})

const frets = computed(() => {
  let arr = []
  for (let i = 1; i < instrument.value.frets; i++) {
    arr.push((1 - Math.pow(0.9438743, i)))
  }
  return arr
});

function noteColor(note, semitones) {
  return colord(freqColor(Note.freq(Note.transpose(note, Interval.fromSemitones(semitones))))).toHex()
}

</script>

<template lang="pug">
.flex.flex-col
  .flex.flex-wrap.items-center.m-auto
    .flex.items-center.px-4
      .text-xl Instrument
      select.bg-transparent.text-xl.w-10rem.m-2.p-2(v-model="instrument.title")
        option(v-for="(inst, key) in instruments", :key="key", :value="key") {{ key }}
    .flex.items-center.px-4
      .text-xl Scale length
      input.bg-transparent.text-2xl.w-5rem.m-2.p-2(
        type="number", 
        inputmode="numeric"
        pattern="[0-9]*"
        v-model="instrument.l"
        )
      .text-xl mm
    .flex.items-center.px-4
      .text-xl Frets
      input.bg-transparent.text-2xl.w-4rem.m-2.p-2(
        type="number", 
        inputmode="numeric"
        pattern="[0-9]*"
        v-model="instrument.frets"
        )
  .flex.flex-wrap
    svg#fretboard.flex-1.max-h-3xl.w-full.strings(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 -60 ${instrument.tuning.length * 40 + 100} 1100`",
    xmlns="http://www.w3.org/2000/svg",
    )
      text(
        style="user-select:none;transition:all 300ms ease"
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="16px"
        font-weight="bold"
        text-anchor="middle",
        dominant-baseline="middle"
        :x="(instrument.tuning.length * 40 + 65) / 2",
        :y="-40",
        ) {{ instrument.title }}
      line.string(
        v-for="(string, i) in instrument.tuning",
        key="string"
        stroke="currentColor"
        stroke-width="1"
        stroke-linecap="round"
        :y1="0"
        :x1="40 * i + 50"
        :y2="1000"
        :x2="40 * i + 50"
      )
      line.end(
        v-for="y in [0, 1000]"
        :key="y"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        :y1="y"
        :x1="10"
        :y2="y"
        :x2="instrument.tuning.length * 40 + 55"
      )
      text(
        style="user-select:none;transition:all 300ms ease"
        fill="currentColor"
        font-family="Commissioner, sans-serif"
        font-size="10px"
        font-weight="normal"
        text-anchor="left",
        dominant-baseline="middle"
        :x="instrument.tuning.length * 40 + 20",
        :y="990",
        ) {{ instrument.l }} mm
      circle.inlay(
        v-for="inlay in inlays"
        :key="inlay"
        fill="currentColor"
        :cx="(instrument.tuning.length * 40 + 60) / 2"
        :cy="frets[inlay - 1] * 1000 - (frets[inlay - 1] * 1000 - frets[inlay - 2] * 1000) / 2"
        :r="4"
      )
      g(
        v-for="inlay in octaves"
        :key="inlay"
      )
        circle.inlay(
          fill="currentColor"
          :cx="(instrument.tuning.length * 40 + 60) / 2 - 5"
          :cy="frets[inlay - 1] * 1000 - (frets[inlay - 1] * 1000 - frets[inlay - 2] * 1000) / 2"
          :r="4"
        )
        circle.inlay(
          fill="currentColor"
          :cx="(instrument.tuning.length * 40 + 60) / 2 + 5"
          :cy="frets[inlay - 1] * 1000 - (frets[inlay - 1] * 1000 - frets[inlay - 2] * 1000) / 2"
          :r="4"
        )
      g.fret(
        v-for="(fret, f) in frets"
        :key="fret"
      )
        line(
          stroke="gray"
          stroke-width="1"
          stroke-linecap="round"
          :y1="fret * 1000"
          :x1="20"
          :y2="fret * 1000"
          :x2="instrument.tuning.length * 40 + 40"
        )
        text(
          style="user-select:none;transition:all 300ms ease"
          fill="currentColor"
          font-family="Commissioner, sans-serif"
          font-size="10px"
          font-weight="normal"
          text-anchor="middle",
          dominant-baseline="middle"
          :x="24",
          :y="fret * 1000 - 8",
        ) {{ f + 1 }}
        text(
          style="user-select:none;transition:all 300ms ease"
          fill="currentColor"
          font-family="Commissioner, sans-serif"
          font-size="10px"
          font-weight="normal"
          text-anchor="left",
          dominant-baseline="middle"
          :x="instrument.tuning.length * 40 + 30",
          :y="fret * 1000 - 8",
        ) {{ (fret * instrument.l).toFixed(2) }} mm
      g.note(
        v-for="(string, i) in instrument.tuning", :key="string"
        )
        g(@click="selectNote(string, 0, i)")
          circle(
            :cy="-12"
            :cx="i * 40 + 50"
            :r="12"
            :fill="noteColor(string, 0)"
          )
          text(
            style="user-select:none;transition:all 300ms ease"
            fill="white"
            font-family="Commissioner, sans-serif"
            font-size="10px"
            font-weight="bold"
            text-anchor="middle",
            dominant-baseline="middle"
            :x="i * 40 + 50",
            :y="-11",
          ) {{ string }}
        g.note(
          v-for="(fret, f) in frets"
          :key="fret"
          @click="selectNote(Note.transpose(string, Interval.fromSemitones(f + 1)), f, i)"
        )
          circle(
            :cy="fret * 1000 - 12"
            :cx="i * 40 + 50"
            :r="12"
            :fill="noteColor(string, f + 1)"
          )
          text(
          style="user-select:none;transition:all 300ms ease"
          fill="white"
          font-family="Commissioner, sans-serif"
          font-size="10px"
          font-weight="bold"
          text-anchor="middle",
          dominant-baseline="middle"
          :x="i * 40 + 50",
          :y="fret * 1000 - 11",
        ) {{ Note.transpose(string, Interval.fromSemitones(f + 1)) }}
</template>

<style scoped>
.strings {
  max-height: none !important;
  height: 1600px;
}
.note {
  @apply cursor-pointer;
}
</style>