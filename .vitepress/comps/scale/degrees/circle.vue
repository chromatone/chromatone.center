<script setup>
import { intervals } from '#use/theory'
import { globalScale } from '#use/chroma'
import { pitchColor, getCircleCoord, rotateArray } from '#use/calculations'
import { notes } from '#use/theory'

const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i }))

const noteR = 140
const noteSize = 30
const pathUp = 350;
const pathBottom = 300
const fifthsR = noteR - noteSize;
const outerR = 330
const thickness = 330
const innerR = 260
const pathIn = innerR - 30

const props = defineProps({
  chroma: {
    type: String,
    default: '1010110101010',
  },
  fixed5: {
    type: Boolean,
    default: false,
  }
})
const emit = defineEmits(['update:chroma'])

function toggleChroma(n) {
  if (n == 0) return
  let arr = props.chroma.split('')
  if (arr[n] == 1) {
    arr[n] = 0
  } else {
    arr[n] = 1
  }
  emit('update:chroma', arr.join(''))
}

function toggleDegree(steps) {

  let arr = props.chroma.split('')
  let one = steps[0]
  if (one == 0) return
  if (one == 7 && props.fixed5) return
  if (steps.length == 1) {
    arr[one] == 1 ? arr[one] = 0 : arr[one] = 1
  } else {
    let two = steps[1]
    if (arr[one] == 0 && arr[two] == 1 || arr[one] == arr[two]) {
      arr[one] = 1
      arr[two] = 0
    } else {
      arr[one] = 0
      arr[two] = 1
    }
  }
  emit('update:chroma', arr.join(''))
}


const degrees = {
  Tonic: {
    arc: [-15, 15],
    steps: [0],
    offset: 550,
    roffset: 475,
    path: "Left",
    roman: 'I',
  },
  Supertonic: {
    arc: [15, 75],
    steps: [1, 2],
    offset: 840,
    roffset: 720,
    path: "Left",
    roman: 'II',
  },
  Mediant: {
    arc: [75, 135],
    steps: [3, 4],
    offset: 1000,
    roffset: 860,
    path: "Right",
    roman: 'III',
  },
  Subdominant: {
    arc: [135, 195],
    steps: [5, 6],
    offset: 650,
    roffset: 550,
    path: "Right",
    roman: 'IV',
  },
  Dominant: {
    arc: [195, 225],
    steps: [7],
    offset: 365,
    roffset: 315,
    path: "Right",
    roman: 'V',
  },
  Submediant: {
    arc: [225, 285],
    steps: [8, 9],
    offset: 100,
    roffset: 85,
    path: "Right",
    roman: 'VI',
  },
  Subtonic: {
    arc: [285, 345],
    steps: [10, 11],
    offset: 270,
    roffset: 230,
    path: "Left",
    roman: 'VII',
  },
};

</script>

<template lang="pug">
svg.select-none.m-2(
  version="1.1",
  baseProfile="full",
  viewBox="100 100 800 800",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none"
  font-family="Commissioner, sans-serif"
  text-anchor="middle",
  dominant-baseline="middle"
  )
  svg-ring.cursor-pointer(
    v-for="degree in degrees" :key="degree"
    @click="toggleDegree(degree.steps)"
    :cx="500"
    :cy="500"
    :radius="outerR"
    :thickness="thickness"
    :from="degree.arc[0]"
    :to="degree.arc[1]"
    :op="0.3"
    :fill="`hsla(${(degree.arc[0] + degree.arc[1]) / 2 + 30 * globalScale.tonic},80%,50%,1)`"
  )
  g.fifths(
    v-for="fifth in 12" :key="fifth"
  )
    line(
      v-if="chroma.split('')[(fifth * 7) % 12] == 1 && chroma.split('')[((fifth + 1) * 7) % 12] == 1"
      :x1="getCircleCoord((fifth * 7) % 12, 12, fifthsR, 1000).x"
      :x2="getCircleCoord(((fifth + 1) * 7) % 12, 12, fifthsR, 1000).x"
      :y1="getCircleCoord((fifth * 7) % 12, 12, fifthsR, 1000).y"
      :y2="getCircleCoord(((fifth + 1) * 7) % 12, 12, fifthsR, 1000).y"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-width="2"
    )
  g.note.cursor-pointer.transition-all.duration-300.ease-out(
    v-for="(note, n) in rotateArray(allNotes, globalScale.tonic)" :key="n"
    :transform="`translate(${getCircleCoord(n, 12, noteR, 1000).x} ${getCircleCoord(n, 12, noteR, 1000).y})`"
    @click="globalScale.tonic = note.pitch"
  )
    circle.transition-all.duration-300.ease(
      :r="noteSize"
      :fill="chroma.split('')[n] == 1 ? pitchColor(note.pitch, 3) : note.name.length == 2 ? '#5552' : '#ccc2'"
    )
    text(font-size="25" fill="currentColor") 
      tspan(  
        text-anchor="middle",
        dominant-baseline="middle"
        ) {{ note.name }}

  g.interval.cursor-pointer(
    v-for="(note, n) in rotateArray(allNotes, globalScale.tonic)" :key="n"
    @click="toggleChroma(n)"
  )
    svg-ring.transition-all.duration-300.ease(
      :cx="500"
      :cy="500"
      :radius="innerR"
      :thickness="60"
      :from="n * 30 - 15"
      :to="n * 30 + 15"
      :fill="chroma.split('')[n] == 1 ? pitchColor(note.pitch, 3) : note.name.length == 2 ? '#5552' : '#ccc2'"
    )
    text(
      :x="getCircleCoord(n, 12, pathIn, 1000).x"
      :y="getCircleCoord(n, 12, pathIn, 1000).y"
      font-size="20"
      text-anchor="middle"
      fill="currentColor"
      ) 
      tspan(  
        text-anchor="middle",
        dominant-baseline="middle"
        ) {{ intervals[n] }}
  path#pathRight(
    :d="`M 500 500 m ${-pathUp}, 0 a ${pathUp}, ${pathUp} 0 1, 0 ${pathUp * 2}, 0  a ${pathUp}, ${pathUp} 0 1, 0  ${-pathUp * 2}, 0`"
    fill="none"
    )
  path#pathLeft(
    :d="`M 500 500 m ${-pathUp}, 0 a ${pathUp}, ${pathUp} 0 1, 1 ${pathUp * 2}, 0  a ${pathUp}, ${pathUp} 0 1, 1  ${-pathUp * 2}, 0`"
    fill="none"
    ) //https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path
  g.degrees
    text(font-size="30")
      textPath(:href="`#path${degree.path}`"  v-for="(degree, d) in degrees" :key="degree" :startOffset="degree.offset"  fill="currentColor") 
        tspan(  
        text-anchor="middle",
        dominant-baseline="middle"
        ) {{ d }}
  path#pathBLeft(
    :d="`M 500 500 m ${-pathBottom}, 0 a ${pathBottom}, ${pathBottom} 0 1, 1 ${pathBottom * 2}, 0  a ${pathBottom}, ${pathBottom} 0 1, 1  ${-pathBottom * 2}, 0`"
    fill="none"
  )
  path#pathBRight(
    :d="`M 500 500 m ${-pathBottom}, 0 a ${pathBottom}, ${pathBottom} 0 1, 0 ${pathBottom * 2}, 0  a ${pathBottom}, ${pathBottom} 0 1, 0  ${-pathBottom * 2}, 0`"
    fill="none"
  )
  g.roman(
    style="pointer-events: none"
  )
    text(font-size="36")
      textPath(:href="`#pathB${degree.path}`" v-for="(degree, d) in degrees" :key="degree" :startOffset="degree.roffset"  fill="currentColor") 
        tspan(  
        text-anchor="middle",
        dominant-baseline="middle"
        ) {{ degree.roman }}

</template>



<style lang="postcss" scoped>
</style>

