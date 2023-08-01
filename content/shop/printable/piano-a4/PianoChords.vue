<script setup>
import PrintKeys from '../PrintKeys.vue'

import { rotateArray } from '#/use/calculations'
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
  majors: [
    { pitch: 3, chroma: '001100010010', type: 'M7' },
    { pitch: 8, chroma: '100100011000', type: 'M7' },
    { pitch: 10, chroma: '001001001010', type: '7' },
  ],
  minors: [
    { pitch: 0, chroma: '100100010010', type: 'm7' },
    { pitch: 5, chroma: '100101001000', type: 'm7' },
    { pitch: 7, chroma: '001001010010', type: 'm7' },
    { pitch: 2, chroma: '101001001000', type: 'ø7' },
  ]
};
const scales = {
  major: ['Ionian', 'Lydian', 'Myxolydian'],
  minor: ['Aeolian', 'Dorian', 'Phrygian', 'Locrian']
};
</script>

<template lang="pug">
svg#diatonic.m-8.select-none(
  version="1.1",
  baseProfile="full",
  :viewBox="`-${box.margin} -${box.margin + box.head} ${box.width + 2 * box.margin} ${box.height + 2 * box.margin + box.head}`",
  xmlns="http://www.w3.org/2000/svg",
  font-family="Commissioner , sans-serif"
  text-anchor="middle",
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
  g.stripe(
    v-for="(tonic, pitch) in notes"
    :key="pitch"
    :transform="`translate(0, ${pitch * (box.height - box.padding.y) / 12})`") 
    rect(
      :x="0"
      :y="box.padding.y - 1"
      rx="4"
      :width="box.width"
      height="22"
      opacity="1"
      :fill="pitch % 2 ? '#ddd' : '#eee'")

  g(
    font-size="4" 
    font-weight="bold")
    //- text(
    //-   :x="13"
    //-   y="-2"
    //- ) Major
    //- text(
    //-   :x="108"
    //-   y="-2"
    //- ) Minor
    line(
      x1="5" 
      x2="93" 
      y1="1" 
      y2="1" 
      stroke-width="0.25" 
      stroke="black")
    line(
      x1="100" 
      x2="208" 
      y1="1" 
      y2="1" 
      stroke-width="0.25" 
      stroke="black")

  g(font-size="4")
    text(
      v-for="(scale, i) in scales.major" 
      :key="scale"
      :x="box.padding.left + 12 + 22 * i"
      y="-2"
    ) {{ scale }}
    text(
      v-for="(scale, i) in scales.minor" 
      :key="scale"
      :x="box.padding.left + 88 + 22 * i"
      y="-2"
    ) {{ scale }}

  g(
    v-for="(tonic, pitch) in notes"
    :key="pitch"
    :transform="`translate(0, ${pitch * (box.height - box.padding.y) / 12})`") 

    print-keys(
      v-for="(chord, maj) in chords.minors" 
      :key="chord"
      :type="chord.type"
      :pitch="(chord.pitch + pitch) % 12"
      :transform="`scale(0.1) translate(${maj * 240 + 1090+ box.padding.left})  `"
      :chroma="rotateArray(chord.chroma.split(''), -pitch).join('')")

    print-keys(
      v-for="(chord, maj) in chords.majors" 
      :key="chord"
      :type="chord.type"
      :pitch="(chord.pitch + pitch) % 12"
      :transform="`scale(0.1) translate(${maj * 240 + 340+ box.padding.left}, 0)  `"
      :chroma="rotateArray(chord.chroma.split(''), -pitch).join('')")

    print-keys(
      :pitch="pitch"
      :transform="`scale(0.1) translate(${0 + box.padding.left},${pitch * 0.1})`"
      :chroma="rotateArray(chords.scale.split(''), -pitch).join('')")

  line(
    :x1="box.padding.left"
    :x2="box.padding.left"
    y1="5"
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