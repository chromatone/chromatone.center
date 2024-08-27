<script setup>
import { freqPitch } from '#/use/calculations'
import { notes } from '#/use/theory'
import { computed, reactive } from 'vue';
import TuningNote from './TuningNote.vue';
import TuningText from './TuningText.vue';

const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i }))

const circles = [250, 350, 450, 150]
const tunings = {
  '12TET equal temperament': 490,
  '5-limit just intonation': 390,
  'Pythagorean tuning': 290,
}
const tuning = reactive({
  middleA: 440,
})


const limit5 = {
  '1/1': 1,
  '16/15': 16 / 15,
  '9/8': 9 / 8,
  '6/5': 6 / 5,
  '5/4': 5 / 4,
  '4/3': 4 / 3,
  '45/32': 45 / 32,
  '3/2': 3 / 2,
  '8/5': 8 / 5,
  '5/3': 5 / 3,
  '9/5': 9 / 5,
  '15/8': 15 / 8,
}

const limitNotes = computed(() => {
  return Object.entries(limit5).map(l => {
    return {
      pitch: freqPitch(l[1] * tuning.middleA),
      name: l[0]
    }
  })
});

const pythagoras = [
  { two: 0, three: 0, inv: false, },
  { two: 8, three: 5, inv: false },
  { two: 3, three: 2, inv: true },
  { two: 5, three: 3, inv: false },
  { two: 6, three: 4, inv: true },
  { two: 2, three: 1, inv: false },
  { two: 9, three: 6, inv: true },
  { two: 1, three: 1, inv: true },
  { two: 7, three: 4, inv: false },
  { two: 4, three: 3, inv: true },
  { two: 4, three: 2, inv: false },
  { two: 7, three: 5, inv: true },
]

const pythNotes = computed(() => {
  return pythagoras.map((n, i) => {
    if (i == 0) return { pitch: 0, name: '1/1' }
    let p = Math.pow(2, n.two) / Math.pow(3, n.three)
    if (n.inv) {
      p = 1 / p
    }
    return {
      pitch: freqPitch(p * tuning.middleA),
      name: !n.inv ? `<tspan>2</tspan><tspan dy="-16" font-size="20px">${n.two}</tspan><tspan dy="16" dx="-5px">/3</tspan><tspan dy="-16" font-size="20px">${n.three}</tspan>` : `<tspan>3</tspan><tspan dy="-16" font-size="16px">${n.three}</tspan><tspan dy="16" dx="-5px">/2</tspan><tspan dy="-16" font-size="20px">${n.two}</tpsan>`
    }
  })
});


// function rotate(arr, count = 1) {
//   return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
// }

</script>

<template lang="pug">
svg#tuning-circle.w-full(
  version="1.1",
  baseProfile="full",
  viewBox="0 -50 1000 1100",
  xmlns="http://www.w3.org/2000/svg",
  )
  circle(
    v-for="r in circles",
    :key="r"
    :cx="500",
    :cy="500"
    :r="r"
    stroke="gray"
    fill="none",
  )
  tuning-note(
    v-for="(note, i) in allNotes", 
    :key="i",
    :r="circles[2]"
    :w="1000"
    :note="note"
  )
  tuning-note(
    v-for="(note, i) in limitNotes", 
    :key="i",
    :r="circles[1]"
    :w="1000"
    :level="2"
    :note="note"
  )
  tuning-note(
    v-for="(note, i) in pythNotes", 
    :key="i",
    :r="circles[0]"
    :w="1000"
    :level="1"
    :note="note"
  )
  tuning-text(
    v-for="(r, tune) in tunings"
    :key="tune"
    :r="r"
    :text="tune"
    :offset="0"
  )
</template>

<style lang="postcss" scoped></style>