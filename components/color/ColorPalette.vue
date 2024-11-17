<script setup>
import { Poline } from 'poline'
import { reactive, computed, ref } from 'vue'

import nearestColor from 'nearest-color';
import { colornames } from 'color-name-list';
import { colord } from 'colord';
import { useStorage, useClipboard } from '@vueuse/core';

// nearestColor need objects {name => hex} as input
const colors = colornames.reduce((o, { name, hex }) => Object.assign(o, { [name]: hex }), {});

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
  h: computed(() => h.control * 2 + h.row * (options.numPoints + 2)),
  pad: 60
})

const source = ref('')
const { text, copy, copied, isSupported } = useClipboard({ source })

function copyColor(str) {
  source.value = str
  copy()
  console.log(str)
}

</script>

<template lang='pug'>
svg.select-none.cursor-grab.active-cursor-grabbing(
  version="1.1",
  baseProfile="full",
  :viewBox="`0 0 ${box.w} ${box.h + box.pad * 2}`",
  xmlns="http://www.w3.org/2000/svg",
  stroke-width="2px"
  dominant-baseline="middle"
  style="touch-action: none;"
  )

  defs
    mask#myMask
      rect(fill="#fff", rx="30", :y="h.control + box.pad", :width="box.w", :height="h.row * (options.numPoints + 2)")

    mask#maskControl1
      rect(fill="#fff", rx="30", :y="0", :width="box.w", :height="h.control")

    mask#maskControl2
      rect(fill="#fff", rx="20", :y="h.control + box.pad", :width="box.w", :height="h.row * (options.numPoints + 2)")


  g.steps(font-size="40" mask="url(#myMask)")
    rect(:y="h.control" :width="box.w" :height="h.row * (options.numPoints + 2)" fill="transparent" opacity="0" v-drag="dragSteps")
    g.step( 
      v-for="(color, c) in palette" :key="c" 
      :transform="`translate(0,${c * h.row + h.control + box.pad})`"
      )
      rect.pointer-events-none(
        :width="box.w" :height="h.row" 
        :fill="colord(toHSL(color)).toHex()"
        )
      g.text(
        :fill="colord(toHSL(color)).isDark() ? '#fff' : '#000'")
        text.pointer-events-none(x="40" :y="h.row / 2" text-anchor="middle")  {{ c + 1 }}
        text(
          @click="copyColor(nearest(colord(toHSL(color)).toHex()).name)"
          x="80" :y="h.row / 2")  {{ nearest(colord(toHSL(color)).toHex()).name }}
        text.cursor-pointer(
          @click="copyColor(colord(toHSL(color)).toHex())"
          :x="box.w - 200" :y="h.row / 2" ) {{ colord(toHSL(color)).toHex() }}

  g.controls()
    g.control(
      mask="url(#maskControl1)"
      :fill="colord(toHSL(ctrl == 0 ? palette[0] : palette[palette.length - 1])).toHex()" 
      v-for="(ctrl, c) in [0, 1]" :key="ctrl"
      :transform="`translate(0,${ctrl == 0 ? 0 : box.h - h.control + c * box.pad * 2})`"
      )

      defs
        linearGradient(:id="`sat${c}`" x1="0" x2="0" y1="1" y2="0")
          stop(offset="5%", :stop-color="`hsl(${options.anchorColors[c][0]},${0}%,${options.anchorColors[c][2] * 100}%)`")
          stop(offset="95%", :stop-color="`hsl(${options.anchorColors[c][0]},${100}%,${options.anchorColors[c][2] * 100}%)`")

        linearGradient(:id="`light${c}`" x1="0" x2="0" y1="1" y2="0")
          stop(offset="5%", :stop-color="`hsl(${options.anchorColors[c][0]},${0}%,${0}%)`")
          stop(offset="50%", :stop-color="`hsl(${options.anchorColors[c][0]},${options.anchorColors[c][1] * 100}%,${50}%)`")
          stop(offset="95%", :stop-color="`hsl(${options.anchorColors[c][0]},${options.anchorColors[c][1] * 100}%,${100}%)`")


      rect(:fill="`url(#sat${c})`" :width="box.w * options.anchorColors[ctrl][0] / 360" :height="h.control" v-drag="dragHandler(ctrl, 0)")
      rect(:fill="`url(#light${c})`" :x="box.w * options.anchorColors[ctrl][0] / 360" :width="box.w * (1 - options.anchorColors[ctrl][0] / 360)" :height="h.control" v-drag="dragHandler(ctrl, 1)")

      g.stroked.pointer-events-none(:stroke="colord(toHSL(ctrl == 0 ? palette[0] : palette[palette.length - 1])).isDark() ? '#fff' : '#000'" stroke-width="4")
        line(:y2="h.control" :transform="`translate(${box.w * options.anchorColors[ctrl][0] / 360},0)`")
        line(:x1="0" :x2="box.w * options.anchorColors[ctrl][0] / 360" :transform="`translate(0,${h.control * (1 - options.anchorColors[ctrl][1])})`")
        line(:x2="box.w" :x1="box.w * options.anchorColors[ctrl][0] / 360" :transform="`translate(0,${h.control * (1 - options.anchorColors[ctrl][2])})`")
        //- line(:x2="box.w" :transform="`translate(0,${ctrl ==0 ? h.control : 0})`")

      g.texts.pointer-events-none(
        :fill="colord(toHSL(ctrl == 0 ? palette[0] : palette[palette.length - 1])).isDark() ? '#fff' : '#000'")

        text(:x="20" :y="-40 + h.control * (1 - options.anchorColors[ctrl][1])" font-size="40" :transform="`translate(0,${options.anchorColors[ctrl][1] > .6 ? 80 : 0})`") S {{ (options.anchorColors[ctrl][1] * 100).toFixed(1) }}%

        text(:x="box.w - 180" :y="-40 + h.control * (1 - options.anchorColors[ctrl][2])" font-size="40" :transform="`translate(0,${options.anchorColors[ctrl][2] > .6 ? 80 : 0})`") L {{ (options.anchorColors[ctrl][2] * 100).toFixed(1) }}%

        text(
          :y="-40 + h.control * (1 - options.anchorColors[ctrl][2])" 
          :x="20 + box.w * options.anchorColors[ctrl][0] / 360" y="40" font-size="40" :transform="`translate(0,${options.anchorColors[ctrl][0] > .6 ? 80 : 0})`") H {{ options.anchorColors[ctrl][0].toFixed(1) }}&deg;   
  transition(name="fade")
    g.copied.text-2xl(
      v-show="copied"
      :transform="`translate(${box.w / 2 - 100},${h.control + box.pad / 2})`"
      )
      text.fill-white() Copied '{{ text }}''
</template>