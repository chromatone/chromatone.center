<template lang="pug">
.flex.flex-col.items-center
  .flex.flex-wrap
    .note(
      v-for="note in notes"
      :key="note"
      @click="select(note.pitch)"
      :class="{ active: activeNotes[note.pitch] }"
      :style="{ backgroundColor: activeNotes[note.pitch] ? pitchColor(note.pitch) : note.pos == 1 ? '#333' : '#aaa' }"
    ) {{ note.name }}
  .p-4.flex.flex-wrap.items-center
    label(
      for="zoom"
    ) ZOOM
    input.m-2(
      id="zoom"
      type="range"
      min="75"
      max="1000"
      v-model="zoom"
    )
    label(
      for="speed"
    ) SPEED
    input.m-2(
      id="speed" 
      type="range"
      min="10"
      max="150"
      v-model="speed"
    )
    button(
      @click="moving = !moving"
    )
      la-pause(v-if="moving")
      la-play(v-else)

    button(
      @click="sounding = !sounding"
    )
      la-volume-up(v-if="!sounding")
      la-volume-off(v-else)
  svg#chord-form(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1260 800",
    xmlns="http://www.w3.org/2000/svg",
  )
    line(
      x1="0"
      x2="1200"
      y1="400"
      y2="400"
      stroke="gray"
      stroke-width="1"
    )
    g(
      v-for="(note,n) in activeNotes"
      :key="n"
    )
      polyline(
        :stroke="pitchColor(n)"
        :points="waves[n]"
        stroke-width="2"
        fill="none"
      )
      circle(
        :cx="1200"
        :cy="400"
        :transform="`translate(0,${computeSine(n, numPoints - 1) * 100})`"
        r="6"
        :fill="pitchColor(n)"
      )
    polyline(
      :stroke="sumColor.hsl"
      :points="sumLine"
      stroke-width="12"
      fill="none"
    )
    circle(
      :cx="1200"
      :cy="400"
      :transform="`translate(0,${sumWave[numPoints - 1] * 100})`"
      r="12"
      :fill="sumColor.hsl"
    )
</template>

<script setup>
import { notes, pitchColor } from 'chromatone-theory'
import { reactive, computed, ref, watch, watchEffect } from 'vue'
import { useStorage, useTimestamp } from '@vueuse/core'
import { chromaColorMix } from "@use/colors.js";
import { useSynth } from '@use/synth.js'
const frequencies = []
for (let f = 0; f < 13; f++) {
  frequencies[f] = Math.pow(2, f / 12)
}

const width = 1200
const numPoints = 600
const ratio = width / numPoints

const { timestamp, pause, resume } = useTimestamp({ controls: true, offset: Date.now() })
const moving = useStorage('chord-moving', true)
watch(moving, val => {
  if (val) {
    resume()
  } else {
    pause()
  }
})

const activeNotes = useStorage('chord-notes-obj', {})


const sounding = ref(false)
const { synthAttack, synthReleaseAll } = useSynth()
watchEffect(() => {
  synthReleaseAll()
  if (sounding.value) {
    for (let note in activeNotes.value) {
      let oct = note < 3 ? 3 : 4;
      synthAttack(notes[note].name + oct)
    }
  }
})

const zoom = useStorage('chord-zoom', 400)
const speed = useStorage('chord-speed', 100)
function select(pitch) {
  activeNotes.value[pitch] ? delete activeNotes.value[pitch] : activeNotes.value[pitch] = true
}

function computeSine(note, pos) {
  return Math.sin((pos + timestamp.value * speed.value / 1000) * (Math.PI * 2 * frequencies[note]) / zoom.value)
}

const chroma = computed(() => {
  let str = '000000000000'
  let split = str.split('')
  for (let n in activeNotes.value) {
    split[Number(n)] = '1'
  }
  str = split.join('')
  return str
})

const waves = computed(() => {
  let obj = {}
  for (let note in activeNotes.value) {
    obj[note] = []
    for (let x = 0; x < numPoints; x++) {
      obj[note].push(`${x * ratio},${computeSine(Number(note), x) * 100 + 400}`)
    }
  }
  return obj
})

const sumWave = computed(() => {
  let arr = []
  for (let w = 0; w < numPoints; w++) {
    arr[w] = 0
    for (let note in activeNotes.value) {
      let num = Number(note)
      arr[w] += computeSine(num, w)
    }
  }
  return arr
});

const sumLine = computed(() => {
  return sumWave.value.map((y, i) => `${i * ratio},${y * 100 + 400}`).join(' ')
})

const sumColor = computed(() => {
  return chromaColorMix(chroma.value, Object.keys(activeNotes.value)[0])
});
</script>

<style scoped>
.note {
  @apply text-light-100 transition-all duration-400 p-2 m-1 w-2.5rem text-center font-bold rounded-full shadow-lg cursor-pointer;
  filter: grayscale(100%);
}
.note.active {
  filter: grayscale(0%);
}

button {
  @apply p-2 m-2 border-1 rounded flex flex-col items-center;
}
</style>