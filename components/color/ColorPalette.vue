<script setup>
import { Poline } from 'poline'
import { reactive, computed } from 'vue'

import nearestColor from 'nearest-color';
import colorNameList from 'color-name-list/dist/colornames.json';
import { colord } from 'colord';
import { useStorage } from '@vueuse/core';

// nearestColor need objects {name => hex} as input
const colors = colorNameList.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});

const nearest = nearestColor.from(colors);

const options = reactive({
  anchorColors: useStorage('poline-anchors', [[0, 0.5, 0.5], [120, 0.5, 0.5]]),
  numPoints: useStorage('poline-steps', 3)
})

const palette = computed(() => new Poline(options).colors)

function dragHandler(anchor = 0, param = 0) {

  return function (ev) {
    options.anchorColors[anchor][0] = mod(options.anchorColors[anchor][0] + ev.delta[0] / 10, 360)
    options.anchorColors[anchor][param + 1] = clamp(options.anchorColors[anchor][param + 1] - ev.delta[1] / 1000, 0, 1)
  }

}

function toHSL(color) {
  return `hsl(${color[0]},${color[1] * 100}%,${color[2] * 100}%)`
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function clamp(val, min = 0, max = 1) {
  return Math.max(min, Math.min(max, val))
}

let dragger = options.numPoints
function dragSteps(ev) {
  dragger = dragger + ev.delta[1] / 100
  options.numPoints = clamp(Math.round(dragger), 1, 10)
}

const h = reactive({
  control: 200,
  row: 100
})

const box = reactive({
  w: 1000,
  h: computed(() => h.control * 2 + h.row * (options.numPoints + 2))
})

function dragSat(ev) {
  console.log(ev)
}

</script>

<template lang='pug'>
svg.w-full.select-none.cursor-grab.active-cursor-grabbing(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0 ${box.w} ${box.h}`",
  xmlns="http://www.w3.org/2000/svg",
  stroke-width="2px"
  dominant-baseline="middle"
  style="touch-action: none;"
  )
  g.steps(font-size="40")
    g.step( 
      v-for="(color,c) in palette" :key="c" 
      :transform="`translate(0,${ c*h.row+h.control })`"
      )
      rect(
        :width="box.w" :height="h.row" 
        :fill="colord(toHSL(color)).toHex()"
        )
      g.text(:fill="colord(toHSL(color)).isDark() ? '#fff' : '#000'")
        text(x="40" :y="h.row/2" text-anchor="middle")  {{c+1}}
        text(x="80" :y="h.row/2")  {{ nearest(colord(toHSL(color)).toHex()).name }}
        text(:x="box.w-200" :y="h.row/2" ) {{ colord(toHSL(color)).toHex() }}
    rect(:y="h.control" :width="box.w" :height="h.row*(options.numPoints+2)" fill="transparent" opacity="0" v-drag="dragSteps")

  g.controls()
    g.control(
      :fill="colord(toHSL(ctrl == 0 ?palette[0] : palette[palette.length-1])).toHex()" 
      v-for="ctrl in [0,1]" :key="ctrl"
      :transform="`translate(0,${ctrl==0 ? 0 : box.h-h.control})`"
      )
      rect(:width="box.w*options.anchorColors[ctrl][0]/360" :height="h.control" v-drag="dragHandler(ctrl,0)")
      rect(:x="box.w*options.anchorColors[ctrl][0]/360" :width="box.w*(1-options. anchorColors[ctrl][0]/360)" :height="h.control" v-drag="dragHandler(ctrl,1)")
      g.stroked.pointer-events-none(:stroke="colord(toHSL(ctrl == 0 ? palette[0] : palette[palette.length-1])).isDark() ? '#fff' : '#000'" stroke-width="4")
        line(:y2="h.control" :transform="`translate(${box.w*options.anchorColors[ctrl][0]/360},0)`")
        line(:x1="0" :x2="box.w*options.anchorColors[ctrl][0]/360" :transform="`translate(0,${h.control*(1-options.anchorColors[ctrl][1])})`")
        line(:x2="box.w" :x1="box.w*options.anchorColors[ctrl][0]/360" :transform="`translate(0,${h.control*(1-options.anchorColors[ctrl][2])})`")
        line(:x2="box.w" :transform="`translate(0,${ctrl ==0 ? h.control : 0})`")
      g.texts.pointer-events-none(
        :fill="colord(toHSL(ctrl == 0 ? palette[0] : palette[palette.length-1])).isDark() ? '#fff' : '#000'"  
        )
        text(:x="20" :y="-40+h.control* (1-options.anchorColors[ctrl][1])" font-size="40" :transform="`translate(0,${options.anchorColors[ctrl][1] > .6 ? 80:0})`") S {{ (options.anchorColors[ctrl][1]*100).toFixed(1) }}%
        text(:x="box.w-180" :y="-40+h.control* (1-options.anchorColors[ctrl][2])" font-size="40" :transform="`translate(0,${options.anchorColors[ctrl][2] > .6 ? 80:0})`") L {{ (options.anchorColors[ctrl][2]*100).toFixed(1) }}%
        text(:x="20+box.w*options.anchorColors[ctrl][0]/360" y="40" font-size="40" :transform="`translate(${options.anchorColors[ctrl][0] > 240 ? -200:0},0)`") H {{ options.anchorColors[ctrl][0].toFixed(1) }}&deg;   
</template>