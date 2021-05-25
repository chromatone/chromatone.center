<template lang="pug">
.flex.flex-col
  .flex.flex-wrap.items-center.m-auto
    .flex.items-center.p-4
      .text-xl Scale length
      input.text-2xl.w-5rem.m-2.p-2(type="number", v-model="stringParams.l")
      .text-xl mm
    .flex.items-center.p-4
      .text-xl Frets
      input.text-2xl.w-4rem.m-2.p-2(type="number", v-model="stringParams.frets")
  svg.max-h-3xl.w-full(
  version="1.1",
  baseProfile="full",
  :viewBox="`-50 0 1100 ${strings.length * 50 + 60}`",
  xmlns="http://www.w3.org/2000/svg",
  )
    line.string(
      v-for="(string, i) in strings",
      key="string"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      :x1="0"
      :y1="50 * i + 50"
      :x2="1000"
      :y2="50 * i + 50"
    )
    line.end(
      v-for="x in [0,1000]"
      :key="x"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      :x1="x"
      :y1="10"
      :x2="x"
      :y2="strings.length * 50 + 40"
    )
    line(
      v-for="fret in frets"
      :key="fret"
      stroke="gray"
      stroke-width="1"
      stroke-linecap="round"
      :x1="fret * 1000"
      :y1="20"
      :x2="fret * 1000"
      :y2="strings.length * 50 + 30"
    )
    g(v-for="(string,i) in strings", :key="string")
      circle(
        :cx="-8"
        :cy="i * 50 + 50"
        :r="8"
        :fill="freqColor(Note.freq(string))"
      )
      circle(
        v-for="(fret,f) in frets"
        :cx="fret * 1000 - 8"
        :cy="i * 50 + 50"
        :r="8"
        :fill="freqColor(Note.freq(Note.transpose(string, Interval.fromSemitones(f + 1))))"
      )
  .overflow-x-scroll.max-w-full
    table.text-center.border-separate.m-auto
      tr
        th.w-1rem Fret
        th.w-8rem Distance
        th(v-for="string in strings", :key="string", :style="{ color: freqColor(Note.freq(string)) }") {{ string }}
      tr(v-for="(fret,i) in frets", :key="i")
        td {{ i + 1 }}
        td {{ (fret * stringParams.l).toFixed(2) }} mm
        td.rounded-xl(
          v-for="string in strings",
          :key="string"
          :style="{ color: freqColor(Note.freq(Note.transpose(string, Interval.fromSemitones(i + 1)))) }"
            ) {{ Note.transpose(string, Interval.fromSemitones(i + 1)) }}
   
</template>

<script setup>
import { defineProps, reactive, computed } from 'vue'
import { useStorage } from '@vueuse/core'
import { Note, Interval } from '@tonaljs/tonal'
import { freqColor } from 'chromatone-theory'

const stringParams = useStorage('stringParams-calc', {
  l: 430,
  frets: 27,
});

const strings = useStorage('string-collection', ['C4', 'G4', 'E4', 'A4'])

const frets = computed(() => {
  let arr = []
  for (let i = 1; i < stringParams.value.frets; i++) {
    arr.push((1 - Math.pow(0.9438743, i)))
  }
  return arr
});

</script>

<style scoped>
table {
  border-spacing: 4px;
}
</style>