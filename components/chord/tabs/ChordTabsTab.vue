<script setup>
import { notes as noteList } from '#/use/theory'
import { noteColor } from "#/use/colors"
import { colord } from 'colord'
import { computed, reactive } from 'vue';
const props = defineProps({
  frets: { type: Array, default: () => [] },
  fingers: { type: Array, default: () => [] },
  baseFret: { type: Number, default: 0 },
  barres: { type: Array, default: () => [] },
  midi: { type: Array, default: () => [] },
  name: { type: String, default: '' },
  pitch: { type: Number, default: 0 },
})
const neck = reactive({
  stringWidth: 50,
  fretHeight: 60,
  width: computed(() => (props.frets.length - 1) * 50),
  height: computed(() => (4 * neck.fretHeight)),
  padX: 40,
  padY: 40,
  dots: [3, 5, 7, 10]
});
const notes = reactive({
  chordColor: computed(() => colord(noteColor(props.pitch, 3)).toHex()),
  list: computed(() => props.midi.map(m => (m + 3) % 12)),
  colors: computed(() => notes.list.map(n => colord(noteColor(n, 3)).toHex()))
});
</script>

<template lang="pug">
svg.max-h-360px.min-w-60px.min-h-220px(
  version="1.1",
  baseProfile="full",
  :viewBox="`${-neck.padX} ${-neck.padY} ${neck.width + 2 * neck.padX} ${neck.height + 2 * neck.padY}`",
  xmlns="http://www.w3.org/2000/svg",
  font-family="Commissioner, sans-serif"
  font-size="20px"
  text-anchor="middle",
  dominant-baseline="middle"
)
  text(
    v-if="name"
    font-weight="bold"
    :fill="notes.chordColor"
    font-size="16px"
    :x="neck?.width / 2"
    :y="-30"
  ) {{ name }}
  line.top(
    :y1="baseFret == 1 ? 4 : 0"
    :y2="baseFret == 1 ? 4 : 0"
    :x1="baseFret == 1 ? 2 : 0"
    :x2="baseFret == 1 ? neck.width - 2 : neck.width"
    stroke="currentColor"
    stroke-linecap="square"
    :stroke-width="baseFret == 1 ? 8 : 2"
  )
  g.frets(
    v-for="(fret) in 4" 
    :key="fret")
    text(
      :x="neck.width + 10"
      :y="fret * neck.fretHeight - neck.fretHeight / 2"
      font-size="18px"
      fill="currentColor"

    ) {{ fret + baseFret - 1 }}
    line.fret(
      x1="0"
      :x2="neck.width"
      :y1="fret * neck.fretHeight"
      :y2="fret * neck.fretHeight"
      stroke="currentColor"
    )
    circle(
      v-if="neck.dots.find(dot => dot == fret + baseFret - 1)"
      :cx="neck.width / 2"
      :cy="fret * neck.fretHeight - neck.fretHeight / 2"
      r="10"
      fill="gray"
    )
  g.strings(
    v-for="(string, s) in frets" 
    :key="s")
    line(
      :x1="s * neck.stringWidth"
      :x2="s * neck.stringWidth"
      :y1="0"
      :y2="neck.height"
      :stroke="string >= 0 ? notes.colors[s] : 'gray'"
      stroke-width="4px"
    )
    circle(
      v-if="string >= 0"
      :cx="s * neck.stringWidth"
      :cy="neck.height + 10"
      r="10"
      :fill="notes.colors[s]"
    )
    text(
      v-if="string >= 0"
      fill="white"
      :x="s * neck.stringWidth"
      :y="neck.height + 14"
      font-size="12px"
      font-weight="bold"
    ) {{ noteList[notes.list[s]] }}
  g.barres
    line(
      v-for="barre in barres" 
      :key="barre"
      x1="0"
      :x2="neck.width"
      :y1="barre * neck.fretHeight - neck.fretHeight / 2"
      :y2="barre * neck.fretHeight - neck.fretHeight / 2"
      stroke-width="48px"
      stroke-linecap="round"
      stroke="gray"
      opacity="0.5"
    )
  g.notes(
    v-for="(note, n) in frets" 
    :key="n")
    circle(
      v-if="note == 0"
      :cx="n * neck.stringWidth"
      cy="-15"
      r="8"
      fill="none"
      stroke-width="6px"
      :stroke="notes.colors[n]"
    )
    g.x(
      v-if="note == -1"
      stroke-width="4px"
      :transform="`translate(${n * neck.stringWidth}, -15)`"
    )
      line(
        x1="-10" 
        x2="10" 
        y1="-10" 
        y2="10" 
        stroke="currentColor"
      )
      line(
        x1="-10" 
        x2="10" 
        y1="10" 
        y2="-10" 
        stroke="currentColor"
      )
    circle(
      v-if="note > 0"
      :cx="n * neck.stringWidth"
      :cy="note * neck.fretHeight - neck.fretHeight / 2"
      :r="20"
      :fill="notes.colors[n]"
    )
    text(
      v-if="note > 0"
      fill="white"
      font-weight="bold"
      :x="n * neck.stringWidth"
      :y="note * neck.fretHeight - neck.fretHeight / 2 + 5"
    ) {{ fingers[n] }}
</template>

<style lang="postcss" scoped></style>