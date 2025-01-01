<script setup>
import PrintKeys from '../PrintKeys.vue'
import { notes } from '#/use/theory'
import { reactive } from 'vue';

const box = reactive({
  width: 210,
  height: 297,
  margin: 6,
  head: 10,
  padding: {
    x: 4,
    y: 4,
    left: 31.2
  }
});
const chords = {
  scale: '101101011010',
  list: [
    { pitch: 0, chroma: '100100010010', type: 'm7', scale: 'Aeolian', degree: 'I' },
    { pitch: 2, chroma: '100100100010', type: 'ø7', scale: 'Locrian', degree: 'II' },
    { pitch: 3, chroma: '100010010001', type: 'M7', scale: 'Ionian', degree: 'III' },
    { pitch: 5, chroma: '100100010010', type: 'm7', scale: 'Dorian', degree: 'IV' },
    { pitch: 7, chroma: '100100010010', type: 'm7', scale: 'Phrygian', degree: 'V' },
    { pitch: 8, chroma: '100010010001', type: 'M7', scale: 'Lydian', degree: 'VI' },
    { pitch: 10, chroma: '100010010010', type: '7', scale: 'Myxolydian', degree: 'VII' },
  ]
};
</script>

<template lang="pug">
svg#diatonic.m-8.select-none(
  version="1.1",
  baseProfile="full",
  :viewBox="`-${box.margin} -${box.margin + box.head} ${box.width + 2 * box.margin} ${box.height + 2 * box.margin + box.head}`",
  xmlns="http://www.w3.org/2000/svg",
  font-family="Commissioner, sans-serif"
  text-anchor="start",
  dominant-baseline="middle"
  )
  rect.page(
    x="-2"
    :y="- box.head"
    :width="box.width + box.padding.x"
    :height="box.height + box.head"
    stroke="none"
    stroke-width="0.2"
    rx="1"
    fill="#fff"
    )

  text(font-size="3" transform="translate(3,-1)")
    tspan CHROMATONE
    tspan(dy="4" x="0") SCALE CHORDS
    tspan(dy="4" x="0") PIANO KEYS

  g.striped(
    v-for="(tonic, pitch) in notes"
    :key="pitch"
    :transform="`translate(0, ${box.head - 2 + pitch * (box.height - 2 * box.padding.y - 5) / 12})`") 
    rect(
      :x="0"
      :y="box.padding.y"
      rx="4"
      :width="box.width"
      height="22"
      opacity="1"
      :fill="pitch % 2 ? '#ccc' : '#ddd'")

  g.scales(
    font-size="4"
    v-for="(scale, sc) in chords.list" 
    )
    text(
      :transform="`translate(${box.padding.left + sc * 24.6 + 4},3)`"
      ) {{ scale.scale }}

  g(
    v-for="(tonic, pitch) in notes"
    :key="pitch"
    :transform="`translate(0, ${box.head + pitch * (box.height - 2 * box.padding.y - 5) / 12 - 6})`") 

    print-keys(
      v-for="(chord, maj) in chords.list" 
      :key="chord"
      :type="chord.type"
      :pitch="(chord.pitch + pitch) % 12"
      :transform="`translate(${maj * 25 + box.padding.left}, 0) scale(0.1228)`"
      :chroma="chord.chroma")

    print-keys(
      :pitch="pitch"
      :transform="`translate(${1}, 0) scale(0.12)`"
      :chroma="chords.scale")

  line(
    :x1="box.padding.left + 2" 
    x2="208" 
    y1="7" 
    y2="7" 
    stroke-width="0.1" 
    stroke="black")
  line(
    :x1="box.padding.left - 1.5"
    :x2="box.padding.left - 1.5"
    :y1="box.head + 2.2"
    :y2="box.height - 5"
    stroke="#777"
    stroke-linecap="round"
    stroke-width="0.2"
  )

</template>

<style lang="postcss" scoped>
@media screen {
  svg {
    filter: grayscale(20%);
  }
}
</style>