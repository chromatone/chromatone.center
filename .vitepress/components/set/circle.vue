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
    :stroke="pitchColor(tonic + i)"
    stroke-linecap="round"
    stroke-width="10"
    style="mix-blend-mode: multiply"
    :style="{ opacity: active == '1' ? 0.5 : 0 }"
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
    @mousedown="playChord()"
    @touchstart.prevent.stop="playChord()"
    @touchend="stopChord()"
    @touchcancel="stopChord()"
    @mouseup="stopChord()"
    @mouseleave="stopChord()"
    style="cursor:pointer;user-select:none"
    :style="{ fill: pitchColor(tonic) }"
    x="50",
    y="50",
    font-weight="bold"
    font-size="8px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ notes[tonic].name }}{{ !chord.empty ? chord.aliases[0] : '' }}
  text(
    style="cursor:pointer;user-select:none"
    :style="{ fill: pitchColor(tonic) }"
    x="50",
    y="58",
    font-weight="normal"
    font-size="4px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ !ScaleType.get(chroma).empty ? ScaleType.get(chroma).name : '' }}
  text(
    v-if="!ScaleType.get(scaleChroma).empty"
    @click="$emit('clearScale')"
    :style="{ fill: pitchColor(tonic) }"
    style="cursor:pointer;user-select:none"
    x="50",
    y="63",
    font-weight="normal"
    font-size="3px"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    ) {{ !ScaleType.get(scaleChroma).empty ? ScaleType.get(scaleChroma).name : '' }} &times;

  line.line(
    v-for="(line,i) in scaleLines",
    :key="i",
    :stroke="pitchColor(line?.[1])"
    stroke-linecap="round"
    stroke-width="0.5"
    style="mix-blend-mode: multiply; transition: opacity 300ms ease"
    :x1="getCoord(line?.[0], 12, 30).x",
    :y1="getCoord(line?.[0], 12, 30).y",
    :x2="getCoord(line?.[1], 12, 30).x",
    :y2="getCoord(line?.[1], 12, 30).y"
    opacity="0.5"
  )
</template>

<script setup>
import { notes, pitchColor, scales } from 'chromatone-theory'

import { ScaleType, ChordType, Chord, Note } from '@tonaljs/tonal'
import { defineProps, ref, defineEmit, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { mute } from '@theme/composables/state.js'
const props = defineProps({
  tonic: {
    type: Number,
    default: 0
  },
  chroma: {
    type: String,
    default: '100101000110'
  },
  scaleChroma: {
    type: String,
    default: '100011010001'
  },
});

const emit = defineEmit(['update:tonic', 'update:chroma', 'clearScale'])



const chord = computed(() => {
  return ChordType.get(props.chroma)
})

const scaleList = computed(() => {
  return Chord.chordScales(chord.value.aliases[0])
})

const scaleLines = computed(() => {
  let arr = rotate(props.scaleChroma.split(''), -props.tonic)
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
  let n = (24 + Number(num) - props.tonic) % 12

  if (selecting.value) {
    emit('update:tonic', Number(num))
    selecting.value = false
    playChordOnce()
    return
  }
  playNote(num, props.chroma[n] == '1' ? 1 : 0)
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

function rotate(arr, count = 1) {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
};

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

function getCoord(n = 0, total = 12, radius = 35, width = 100) {
  let angle = ((n - 3) / (total / 2)) * Math.PI; // Calculate the angle at which the element will be placed.
  // For a semicircle, we would use (i / numNodes) * Math.PI.
  let x = (radius * Math.cos(angle)) + (width / 2); // Calculate the x position of the element.
  let y = (radius * Math.sin(angle)) + (width / 2); // Calculate the y position of the element.
  return { x, y }
}

import { PolySynth, Frequency, DuoSynth } from 'tone'
import { midi, playOnce as midiOnce, playNote as midiPlay, stopNote as midiStop } from '@use/midi.js'

let synth

onMounted(() => {
  synth = new PolySynth(DuoSynth, {
    maxPolyphony: 12,
    harmonicity: 1,
    volume: -17,
    voice1: {
      envelope: {
        attack: 0.1,
        decay: 0.8,
        sustain: 1,
        release: 4
      }
    },
    voice2: {
      envelope: {
        attack: 0.1,
        decay: 0.8,
        sustain: 1,
        release: 2
      }
    }

  }).toDestination()
})

onBeforeUnmount(() => {
  synth.disconnect().dispose()
})

function playNote(note = 0, octave = 0) {

  if (props.tonic > 0 && note < props.tonic) {
    note = note + 12
  }
  note = note + 12 * octave
  let freq = Frequency(note + 57, 'midi')
  midiOnce({ name: freq.toNote() })
  if (mute.value) return
  synth.triggerAttackRelease(freq, '8n')
}

const chordNotes = computed(() => {
  let shiftChroma = rotate(props.chroma, -props.tonic)
  let chOct = notes.map((n, i) => {
    let oct = 4
    if (i + 9 < props.tonic) oct = 5
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
    midiOnce({ name: name })
  })
  if (mute.value) return
  nextTick(() => {
    chordNotes.value.forEach((note, i) => {
      synth.triggerAttackRelease(note, '8n', `+${i / 3}`)
    })
    synth.triggerAttackRelease(chordNotes.value, '4n', `+${chordNotes.value.length / 3}`)
  });

}
function playChord() {
  chordNotes.value.forEach(name => {
    midiPlay({ name: name })
  })
  if (mute.value) return
  synth.triggerAttack(chordNotes.value)
}

function stopChord() {
  chordNotes.value.forEach(name => {
    midiStop({ name: name })
  })
  if (mute.value) return
  synth.triggerRelease(chordNotes.value)
}


</script>

<style lang="postcss"  scoped>
.around,
.note,
.line {
  transition: all 400ms ease-in-out;
}
</style>