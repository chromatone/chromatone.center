<template lang="pug">
svg.max-h-3xl.w-full(
  version="1.1",
  baseProfile="full",
  viewBox="0 0 100 100",
  xmlns="http://www.w3.org/2000/svg",
  )
  line.line(
    v-for="(active,i) in chroma.split('')",
    :key="i",
    :stroke="pitchColor(globalScale.tonic + i)"
    stroke-linecap="round"
    stroke-width="10"
    style="mix-blend-mode: multiply"
    :style="{ opacity: active == '1' ? 0.5 : 0 }"
    :x1="getCircleCoord(globalScale.tonic).x",
    :y1="getCircleCoord(globalScale.tonic).y",
    :x2="getCircleCoord(globalScale.tonic + i).x",
    :y2="getCircleCoord(globalScale.tonic + i).y"
  )
  g.around(
    style="cursor:pointer"
    v-for="(active,i) in chroma.split('')", 
    :key="i",
    @click="react(i)",
    :opacity="isInChord(i) ? 1 : 0.3"
  )
    circle.note(
      style="transform-box: fill-box; transform-origin: center center;"
      :style="{ transform: `scale(${globalScale.tonic == i ? 2.6 : isInChord(i) ? 1.62 : 1}` }",
      :cx="getCircleCoord(i).x",
      :cy="getCircleCoord(i).y",
      r="5",
      :opacity="globalScale.tonic == i && selecting ? 0.5 : 1"
      :fill="getNoteColor(i)",
    )
    text(
      style="user-select:none;transition:all 300ms ease"
      :fill="scales.minor.steps[i] ? 'hsla(0,0%,0%,0.8)' : 'hsla(0,0%,100%,0.9)'"
      font-family="Commissioner, sans-serif"
      font-size="4px"
      text-anchor="middle",
      dominant-baseline="middle"
      :x="getCircleCoord(i).x",
      :y="getCircleCoord(i).y + 0.5",
    ) {{ notes[i].name }} 
  g(
    @mousedown="playChord()"
    @touchstart.prevent.stop="playChord()"
    @touchend="stopChord()"
    @touchcancel="stopChord()"
    @mouseup="stopChord()"
    @mouseleave="stopChord()"
    style="cursor:pointer;user-select:none;transition: all 300ms ease"
    class="hover:opacity-97"
  )
    circle(
      :cx="50"
      :cy="49"
      :r="12"
      :stroke-width="2"
      :stroke-opacity="0.6"
      style="transition: fill 300ms ease"
      :style="{ fill: colors.lch, stroke: colors.hsl }"
    )
    text(
      :style="{ fill: pitchColor(globalScale.tonic) }"
      x="50",
      y="50",
      font-weight="bold"
      font-size="8px"
      font-family="Commissioner, sans-serif"
      text-anchor="middle",
      dominant-baseline="middle"
      ) {{ notes[globalScale.tonic].name }}{{ !chord.empty ? chord.aliases[0] : '' }}
  text(
    style="cursor:pointer;user-select:none"
    :style="{ fill: pitchColor(globalScale.tonic) }"
    x="50",
    y="58",
    font-weight="normal"
    font-size="4px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ !scaleType.get(chroma).empty ? scaleType.get(chroma).name : '' }}
  text(
    v-if="!scaleType.get(scaleChroma).empty"
    @click="$emit('clearScale')"
    :style="{ fill: pitchColor(globalScale.tonic) }"
    style="cursor:pointer;user-select:none"
    x="50",
    y="63",
    font-weight="normal"
    font-size="3px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ !scaleType.get(scaleChroma).empty ? scaleType.get(scaleChroma).name : '' }} &times;

  line.line(
    v-for="(line,i) in scaleLines",
    :key="i",
    :stroke="pitchColor(line?.[1])"
    stroke-linecap="round"
    stroke-width="0.5"
    style=" transition: all 300ms ease"
    :x1="getCircleCoord(line?.[0], 12, 30).x",
    :y1="getCircleCoord(line?.[0], 12, 30).y",
    :x2="getCircleCoord(line?.[1], 12, 30).x",
    :y2="getCircleCoord(line?.[1], 12, 30).y"
    opacity="0.5"
  )
</template>

<script setup>
import { notes, pitchColor, scales, isInChroma, getCircleCoord } from 'chromatone-theory'
import { lchToHsl, chromaColorMix } from "@use/colors.js";
import { Chord, Note } from '@tonaljs/tonal'
import { scaleType, chordType, globalScale } from '@use/theory'
const props = defineProps({
  chroma: {
    type: String,
    default: '100101000110'
  },
  scaleChroma: {
    type: String,
    default: '100011010001'
  },
});

const emit = defineEmits(['update:chroma', 'clearScale'])

const colors = computed(() => {
  return chromaColorMix(props.chroma, globalScale.tonic)
})

const chord = computed(() => {
  return chordType.get(props.chroma)
})

const scaleList = computed(() => {
  return Chord.chordScales(chord.value.aliases[0])
})

const scaleLines = computed(() => {
  let arr = rotate(props.scaleChroma.split(''), -globalScale.tonic)
  let lines = []
  let step = 0
  let last = 0
  arr.forEach((val, i) => {
    if (i > 0 && val == '1') {
      step++
      lines[step] = [lines[step - 1]?.[1] || 0, i]
      last = i
    }
  })
  if (lines.length > 0) {

    lines.push([last, 0])
  }
  return lines
})

const selecting = ref(false)

function react(num) {
  let n = (24 + Number(num) - globalScale.tonic) % 12

  if (selecting.value) {
    globalScale.tonic = Number(num)
    selecting.value = false
    playChordOnce()
    return
  }
  playNote(num, props.chroma[n] == '1' ? 1 : 0)
  if (Number(num) != globalScale.tonic) {
    let chroma = props.chroma + ''
    if (chroma[n] == '0') {
      chroma = replaceAt(chroma, n, 1)
    } else {
      chroma = replaceAt(chroma, n, 0)
    }
    emit('update:chroma', chroma)
  } else {
    if (selecting.value) {
      globalScale.tonic = n
      selecting.value = false
    } else {
      selecting.value = true
    }
  }
}

function rotate(arr, count = 1) {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
};

function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}

function isInChord(n) {
  return isInChroma(props.chroma, globalScale.tonic, n)
}

function getNoteColor(n) {
  if (isInChord(n % 12)) return pitchColor(n % 12)
  else if (scales.minor.steps[n]) return 'hsla(0,0%,90%,1)'
  else return 'hsla(0,0%,10%,1)'
}

import { Frequency } from 'tone'
import { midiOnce, midiAttack, midiRelease } from '@use/midi.js'
import { synthOnce, synthAttack, synthRelease } from '@use/synth.js'



function playNote(note = 0, octave = 0) {
  if (globalScale.tonic > 0 && note < globalScale.tonic) {
    note = note + 12
  }
  note = note + 12 * octave
  let freq = Frequency(note + 57, 'midi')
  midiOnce(freq.toNote())
  synthOnce(freq)
}

const chordNotes = computed(() => {
  let shiftChroma = rotate(props.chroma, -globalScale.tonic)
  let chOct = notes.map((n, i) => {
    let oct = 4
    if (i + 9 < globalScale.tonic) oct = 5
    return n.name + oct
  })
  let filtered = chOct.filter((val, i) => {
    if (shiftChroma[i] == '1') {
      return true
    }
  })
  return Note.sortedNames(filtered)
})

function playChordOnce() {
  chordNotes.value.forEach(name => {
    midiOnce(name)
  })
  nextTick(() => {
    chordNotes.value.forEach((note, i) => {
      synthOnce(note, '8n', `+${i / 3}`)
    })
    synthOnce(chordNotes.value, '4n', `+${chordNotes.value.length / 3}`)
  });
}

function playChord() {
  chordNotes.value.forEach(name => {
    midiAttack(name)
  })
  synthAttack(chordNotes.value)
}

function stopChord() {
  chordNotes.value.forEach(name => {
    midiRelease(name)
  })
  synthRelease(chordNotes.value)
}

</script>

<style   scoped>
.around,
.note,
.line {
  transition: all 400ms ease-in-out;
}
</style>