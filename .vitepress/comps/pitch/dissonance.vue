<template lang="pug">
svg.max-h-3xl.w-full(
  version="1.1",
  baseProfile="full",
  :viewBox="`${-box.padW} ${-box.padH} ${box.width + 2 * box.padW} ${box.height + box.padH}`",
  xmlns="http://www.w3.org/2000/svg",
  )
  text.pointer-events-none(
    fill="currentColor"
    font-family="Commissioner, sans-serif"
    font-size="32px"
    text-anchor="middle"
    x="600"
    y="-30"
  ) Sensory dissonance curve (for 6 partials harmonic timbre)
  rect(
    x="0"
    y="0"
    width="1200"
    height="500"
    fill="none"
    stroke="currentColor"
    stroke-width="1px"
    opacity="0.5"
  )
  text.pointer-events-none(
    fill="currentColor"
    font-family="Commissioner, sans-serif"
    font-size="25px"
    text-anchor="middle"
    x="-20"
    y="250"
    transform-origin="-20 250"
    transform="rotate(-90)"
  ) Dissonance
  text.pointer-events-none(
    fill="currentColor"
    font-family="Commissioner, sans-serif"
    font-size="25px"
    text-anchor="middle"
    x="600"
    y="570"
  ) Frequency ratio (cents)
  g(
    v-for="(cent, c) in cents"
    :key="cent"
    :transform="`translate(${cent},0)`"

  )
    line(
      stroke="currentColor"
      :x1="0"
      :x2="0"
      :y1="0"
      :y2="530"
      stroke-width="1"
    )
    text.pointer-events-none(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="18px"
      text-anchor="start"
      x="5"
      y="520"
    ) {{ cent }}
  path(
    fill="none", 
    stroke="currentColor", 
    stroke-width="3", 
    stroke-linecap="round", 
    stroke-linejoin="round", 
    stroke-miterlimit="10", 
    d="M0,504.9c22.4-726,93.2-320.8,159.7-254.2c43.1,43.1,63.7,39.9,77.7,48.1c19.7,11.5,27.7,49.8,27.7,49.8c11.4-48.9,35-50,49.8,0.8c18-74.6,51.2-50.4,70.3,21.3c28.9-86.8,97.1-39.9,109.8,25.3c29.4-94.9,76.2-73.7,84.5-22.9c27.4-97.3,109.6-86.7,119.3,86.1c0,0,17.8-110.8,50.6-111.7c32.4-0.9,66.4,13.7,95.6,24.8c21.2,8,37.9,54.5,37.9,54.5s14.2-60.8,42.7-60.8c28.4,0,41.9,53.2,41.9,53.2c20.1-69.4,63.4-42,106.7-65c25.3-13.4,45.4-39.5,67.2-37.1c44.2,4.7,58.8,188,58.8,188")
  g(
    v-for="(frac,idx) in fracPos"
    :key="frac"
    :transform="`translate(${frac} 0)`"
    :stroke="pitchColor(idx, 3)"
  )
    line(
      opacity="1"
      :stroke="pitchColor(idx)"
      stroke-width="3"
      x1="0"
      x2="0"
      y1="0"
      y2="500"
    )
    text.pointer-events-none(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="22px"
      text-anchor="start"
      x="5"
      y="25"
    ) {{ intervals[idx] }}
    text.pointer-events-none(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-size="22px"
      text-anchor="start"
      x="5"
      y="60"
    ) {{ fractions[idx] }}
</template>

<script setup>
import { pitchColor } from 'chromatone-theory'
const box = {
  width: 1200,
  height: 600,
  padW: 100,
  padH: 100,
}
const cents = [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200];
const intervals = ['1P', 'm2', 'M2', 'm3', 'M3', 'P4', 'TT', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8']
const fractions = ['1/1', '16/15', '9/8', '6/5', '5/4', '4/3', '45/32', '3/2', '8/5', '5/3', '9/5', '15/8', '2/1'];
const fracPos = fractions.map(fr => 1200 * Math.log2(eval(fr)));

</script>

<style scoped>
</style>