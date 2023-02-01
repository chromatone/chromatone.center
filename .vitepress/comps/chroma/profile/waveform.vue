<script setup>
import { rotateArray } from '#/use/calculations'
import { useStorage, useRafFn, useTransition, TransitionPresets } from '@vueuse/core'
import { chromaColorMix, noteColor } from "#/use/colors.js";
import { useSynth } from '#/use/synth'
import { playChroma, stopChroma, globalScale } from '#/use/chroma'
import { ref, watchEffect, computed } from 'vue';
const frequencies = []
for (let f = 0; f < 13; f++) {
  frequencies[f] = Math.pow(2, f / 12)
}

const props = defineProps({
  chroma: {
    type: String,
    default: '100010001000'
  },
  mix: {
    type: Boolean,
    default: false,
  }
})

const width = 4000
const height = 300
const numPoints = 2000
const ratio = width / numPoints
const pressed = ref(false)
const time = ref(0)
const speed = ref(0)

const speeder = useTransition(speed, {
  duration: 500,
  transition: [.87, -0.04, .69, 1.13],
  onFinished: (() => {
    if (speed.value == 0) {
      pause()
    }
  })
})

const { resume, pause } = useRafFn(() => {
  time.value += speeder.value
}, { immediate: false })

watchEffect(() => {
  if (pressed.value) {
    resume()
    speed.value = 16
  } else {
    speed.value = 0
  }
})



const activeNotes = computed(() => {
  let active = []
  let chroma = rotateArray(props.chroma.split(''), -globalScale.tonic)
  for (let i = 0; i < 12; i++) {
    if (chroma[i] == 1) {
      active[i] = true
    } else {
      delete active[i]
    }
  }
  return active

})

const zoom = useStorage('chord-zoom', 400)

function computeSine(note, pos) {
  return Math.sin((pos + time.value) * (Math.PI * 2 * frequencies[note]) / zoom.value)
}

const waves = computed(() => {
  let obj = {}
  for (let note in activeNotes.value) {
    obj[note] = []
    for (let x = 0; x < numPoints; x++) {
      obj[note].push(`${x * ratio},${computeSine(Number(note), x) * 100 + height / 2}`)
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
  return sumWave.value.map((y, i) => `${i * ratio},${y * 30 + height / 2}`).join(' ')
})

const sumColor = computed(() => {
  return chromaColorMix(props.chroma, globalScale.tonic)
});


</script>

<template lang="pug">
.waveform
  svg.min-h-4em.w-full.cursor-pointer(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 ${width} ${height}`",
    xmlns="http://www.w3.org/2000/svg",
    @mousedown="playChroma(chroma); pressed = true"
    @touchstart.prevent.stop="playChroma(chroma); pressed = true"
    @touchend="stopChroma(chroma); pressed = false"
    @touchcancel="stopChroma(chroma); pressed = false"
    @mouseup="stopChroma(chroma); pressed = false"
    @mouseleave="stopChroma(chroma); pressed = false"
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
      v-for="(note, n) in activeNotes"
      :key="n"
    )
      polyline(
        :stroke="noteColor(n, 2)"
        :points="waves[n]"
        stroke-width="4"
        fill="none"
        opacity="0.5"
      )
    polyline(
      :stroke="sumColor.hsl"
      :points="sumLine"
      stroke-width="16"
      fill="none"
    )
</template>

<style lang="postcss" scoped>
.waveform {
  flex: 1 1 100%;
}

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