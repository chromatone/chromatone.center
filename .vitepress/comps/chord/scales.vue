<template lang="pug">
.p-4.mx-auto
  h1.text-xl Scales
  svg.m-8(
    version="1.1",
    baseProfile="full",
    :viewBox="`-${box.margin} -${box.margin + box.head} ${box.width + box.margin} ${box.height + box.margin + box.head}`",
    xmlns="http://www.w3.org/2000/svg",
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    )
    rect(
      x=0
      :y="- box.head"
      :width="box.width"
      :height="box.height + box.head"
      stroke="gray"
      stroke-width="0.5"
      rx=4
      fill="none"
      )
    g(font-size="4.5")
      text(
        v-for="(scale,i) in scales.major" :key="scale"
        :x="box.padding.left + 12 + 22 * i"
        y="-2"
      ) {{ scale }}
      text(
        v-for="(scale,i) in scales.minor" :key="scale"
        :x="box.padding.left + 108 + 22 * i"
        y="-2"
      ) {{ scale }}
    g(
      v-for="(tonic,i) in notes"
      :transform="`translate(0, ${i * (box.height - box.padding.y) / 12})`"
      )
      rect(
        :x="box.padding.left"
        :y="box.padding.y - 1"
        rx="4"
        :width="box.width - box.padding.left - box.padding.x"
        height="22"
        :fill="i % 2 ? 'hsla(0,0%,20%,0.1)' : 'hsla(0,0%,80%,0.1)'"
      )
      chord-circle(
        v-for="(chord,maj) in chords.majors" :key="chord"
        :pitch="(chord.pitch + tonic.pitch) % 12"
        :chroma="chord.chroma"
        :transform="`translate(${maj * 22 + 32}, 14)`"
        :type="chord.type"
        :tonic="i"
      )
      chord-circle(
        v-for="(chord,maj) in chords.minors" :key="chord"
        :pitch="(chord.pitch + tonic.pitch) % 12"
        :chroma="chord.chroma"
        :transform="`translate(${maj * 22 + 128}, 14)`"
        :type="chord.type"
        :tonic="i"
      )
      chroma-keys(
        :transform="`scale(0.1) translate(920,${i - 80 + 50})`"
        :chroma="rotateArray(chords.scale.split(''), -i).join('')"
      )
</template>

<script setup>
import { notes, pitchColor, rotateArray } from 'chromatone-theory'
const box = reactive({
  width: 210,
  height: 297,
  margin: 6,
  head: 10,
  padding: {
    x: 4,
    y: 4,
    left: 20,
  }
});
const chords = {
  scale: '101101011010',
  majors: [
    { pitch: 10, chroma: '001001001010', type: '7' },
    { pitch: 8, chroma: '100100011000', type: 'M7' },
    { pitch: 3, chroma: '001100010010', type: 'M7' }
  ],
  minors: [
    { pitch: 0, chroma: '100100010010', type: 'm7' },
    { pitch: 5, chroma: '100101001000', type: 'm7' },
    { pitch: 7, chroma: '001001010010', type: 'm7' },
    { pitch: 2, chroma: '101001001000', type: 'm7b5' },
  ]
};
const scales = {
  major: ['Myxolydian', 'Lydian', 'Ionian'],
  minor: ['Aeolian', 'Dorian', 'Phrygian', 'Locrian']
};
</script>

<style scoped>
</style>