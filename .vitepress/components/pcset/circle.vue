<template lang="pug">
svg.max-h-3xl.w-full(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  )
  line.line(
    v-for="(active,i) in chroma.slice('')",
    :key="i",
    :stroke="pitchColor(tonic + i)"
    stroke-linecap="round"
    stroke-width="10"
    :opacity="active == '1' ? '0.3' : '0'"
    style="mix-blend-mode: multiply; transition: opacity 300ms ease"
    :x1="getCoord(tonic).x",
    :y1="getCoord(tonic).y",
    :x2="getCoord(tonic + i).x",
    :y2="getCoord(tonic + i).y"
  )
  g.around(
    style="mix-blend-mode: screen;cursor:pointer"
    v-for="(active,i) in chroma.slice('')", 
    :key="i",
    @click="react(i)",
    :opacity="isInChord(i) ? 1 : 0.3"
  )
    circle.note(
      style="transform-box: fill-box; transform-origin: center center;"
      :style="{ transform: `scale(${tonic == i ? 2.6 : isInChord(i) ? 1.62 : 1}` }",
      :cx="getCoord(i).x",
      :cy="getCoord(i).y",
      r="5",
      :opacity="tonic == i && selecting ? 0.5 : 1"
      :fill="getNoteColor(i)",
    )
    text(
      style="user-select:none;transition:all 300ms ease"
      :fill="scales.minor.steps[i] ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
      font-family="Commissioner, sans-serif"
      font-size="4px"
      text-anchor="middle",
      dominant-baseline="middle"
      :x="getCoord(i).x",
      :y="getCoord(i).y + 0.5",
    ) {{ notes[i].name }} 

  text(
    style="cursor:pointer;user-select:none"
    :style="{ fill: pitchColor(tonic) }"
    x="50",
    y="50",
    font-weight="bold"
    font-size="10px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ notes[tonic].name }}{{ !chord.empty ? chord.aliases[0] : '' }}
  text(
    style="cursor:pointer;user-select:none"
    :style="{ fill: pitchColor(tonic) }"
    x="50",
    y="57",
    font-weight="normal"
    font-size="4px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ !ScaleType.get(chroma).empty ? ScaleType.get(chroma).name : '' }}
</template>

<script setup>
import { notes, pitchColor, scales } from 'chromatone-theory'
import { Pcset, ScaleType, ChordType, Scale, Chord } from '@tonaljs/tonal'
import { defineProps, ref, defineEmit, computed } from 'vue'
const props = defineProps({
  tonic: {
    type: Number,
    default: 0
  },
  chroma: {
    type: String,
    default: '100101000110'
  },
  pcset: Object,
});

const emit = defineEmit(['update:tonic', 'update:chroma'])

const chord = computed(() => {
  return ChordType.get(props.chroma)
})

const scaleList = computed(() => {
  return Chord.chordScales(chord.value.aliases[0])
})

const selecting = ref(false)

function react(num) {
  let n = (24 + Number(num) - props.tonic) % 12
  if (selecting.value) {
    emit('update:tonic', Number(num))
    selecting.value = false
    return
  }
  if (Number(num) != props.tonic) {
    let chroma = props.chroma + ''
    if (chroma[n] == '0') {
      chroma = replaceAt(chroma, n, 1)
    } else {
      chroma = replaceAt(chroma, n, 0)
    }
    emit('update:chroma', chroma)
  } else {
    if (selecting.value) {
      emit('update:tonic', n)
      selecting.value = false
    } else {
      selecting.value = true
    }
  }
}

function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

function isInChord(n) {
  return props.chroma[(24 + n - props.tonic) % 12] == '1'
}

function getNoteColor(n) {
  if (isInChord(n % 12)) return pitchColor(n % 12)
  else if (scales.minor.steps[n]) return 'hsla(0,0%,90%,1)'
  else return 'hsla(0,0%,10%,1)'
}

function getCoord(n, total = 12, radius = 35, width = 100) {
  let angle = ((n - 3) / (total / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
  // For a semicircle, we would use (i / numNodes) * Math.PI.
  let x = (radius * Math.cos(angle)) + (width / 2); // Calculate the x position of the element.
  let y = (radius * Math.sin(angle)) + (width / 2); // Calculate the y position of the element.
  return { x, y }
}
</script>

<style lang="postcss"  scoped>
.around {
  transition: all 400ms ease-out;
}

.note {
  transition: all 300ms ease-out;
}
</style>