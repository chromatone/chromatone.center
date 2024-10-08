<script setup>
import { rotateArray } from '#/use/calculations'
import { useStorage, useRafFn, useTransition, TransitionPresets } from '@vueuse/core'
import { chromaColorMix, noteColor } from "#/use/colors";
import { playChroma, stopChroma } from '#/use/chroma'
import { globalScale } from '#/use/global'
import { ref, watchEffect, computed } from 'vue';
import { useClamp } from '@vueuse/math';
import { useDrag } from '@vueuse/gesture'
import { useData } from 'vitepress'
const { isDark } = useData()


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
const speedRange = ref(2000)
const waveContainer = ref()
const transitionDuration = ref(1000)
const speedOffset = useClamp(useStorage('waveform-speed', 1000), 0, speedRange)

useDrag((d) => {
  const delta = d.delta[0] - d.delta[1]
  speedOffset.value += delta
}, {
  domTarget: waveContainer
})

const speeder = useTransition(speed, {
  duration: transitionDuration,
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
    if (speed.value > 0) {
      transitionDuration.value = 10
    }
    speed.value = speedOffset.value

  } else {
    speed.value = 0
    transitionDuration.value = 1000
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
.waveform(ref="waveContainer")
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
    g(
      :transform="`translate(${(speedOffset) / (speedRange) * width} 10)`"
      )
      circle(
        r="40"
        :fill="sumColor.hsl"
        )
      text.select-none(
        opacity="0.7"
        font-size="80"
        y="25"
        x="50"
        fill="currentColor"
        ) {{ speedOffset * 60 }} px/sec
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
        :stroke="noteColor(n, isDark ? 8 : 2)"
        :points="waves[n]"
        stroke-width="4"
        fill="none"
        opacity="0.9"
        )
    polyline(
      :stroke="sumColor?.hsl"
      :points="sumLine"
      stroke-width="24"
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