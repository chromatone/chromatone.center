<script setup>
import { useTempo } from '#/use';

const tempo = useTempo()

const getRotation = (ticks = 0, ratio = 1) => ((ticks / (192 * ratio)) % 1) * 360;

const ratios = [6, 5, 4, 3, 2, 1]
</script>

<template lang='pug'>
svg(version="1.1" baseProfile="full" :viewBox="`0 0 500 500`" xmlns="http://www.w3.org/2000/svg")
  g(v-for="ratio in ratios" :key="ratio"
    :transform="`translate(250, 250) rotate(${getRotation(tempo.ticks, ratio)}) `")
    circle(:r="20+ratio*20" fill="#3333" stroke="black" stroke-width="1")
    g(
      v-for="(_,mark) in ratio" :key="mark"
      :transform="`rotate(${360* mark/ratio}) `")
      line(
        :y2="-20-ratio*20" 
        :stroke-width="mark==0? 2:1"
        :stroke="mark==0? 'white':'#aaa3'" 
        )
      circle(
        :r="mark==0? 3:1" fill="#eee" :cy="-20-ratio*20+3" 
        )
  line(transform="translate(250 0)" y1="30" y2="250" stroke="white" opacity=".2")
  circle(r="3" fill="#aaa" :transform="`translate(250, 250) `")
</template>