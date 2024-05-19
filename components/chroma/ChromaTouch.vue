<script setup>
import { noteColor } from '#/use/colors'
import { computed, reactive, ref } from 'vue';
import { notes } from '#/use/theory';
import { useData } from 'vitepress'

import SvgRing from '../svg/SvgRing.vue';

const { isDark } = useData()

const octaves = ref(4)

const box = { w: 100, h: 100, pad: 5, r: 50 }
const svg = ref()

const touches = reactive({})

function handleTouch(t) {
  for (let touch of t.changedTouches) {
    if (['touchend', 'touchcancel'].includes(t.type)) {
      delete touches[touch.identifier]
    } else {
      const { clientX, clientY } = touch
      const point = svg.value.createSVGPoint()
      point.x = clientX
      point.y = clientY
      let correct = point.matrixTransform(svg.value.getScreenCTM().inverse())
      touches[touch.identifier] = {
        x: correct.x,
        y: correct.y,
        angle: 180 * (Math.PI - Math.atan2(correct.x, correct.y)) / Math.PI,
        distance: Math.hypot(correct.x, correct.y) / box.r,
      }
    }
  }
}

</script>

<template lang="pug">
.w-full.max-w-full.h-100vh
  svg.select-none.touch-action-none.max-h-full(
    ref="svg"
    version="1.1",
    baseProfile="full",
    :viewBox="`${-box.r -box.pad} ${-box.r - box.pad} ${box.r*2 +2*box.pad} ${box.r*2 +2*box.pad}`",
    xmlns="http://www.w3.org/2000/svg",
    style="touch-action:none; -webkit-user-select: none !important;  -webkit-touch-callout: none;"
    font-family="Commissioner, sans-serif"
    text-anchor="middle",
    dominant-baseline="middle"
    @touchstart="handleTouch"
    @touchmove="handleTouch"
    @touchend="handleTouch"
    @touchcancel="handleTouch"
    )

    g.octaves
      g.octave.op-20(v-for="(octave,oct) in octaves" :key="octave")
        circle(
          cx="0"
          cy="0"
          :r="box.r - oct*((box.r)/octaves)"
          opacity="0.5"
          :fill="`hsl(0deg,0%,${oct*100}%)`"
          )

        g(v-for="(note,n) in notes" :key="note")
          SvgRing(
            :cx="0"
            :cy="0"
            :radius="box.r - oct*(box.r/octaves)"
            :thickness="box.r/octaves"
            :from="n*30-15"
            :to="(n+1)*30-15"
            :fill="noteColor(n,oct+3)"
          ) 
      g.touches
        g.touch(v-for="(touch,t) in touches" :key="t")
          line(
            stroke-linecap="round"
            :stroke="`hsl(${touch.angle}deg, 50%,50%)`"
            :x2="touch.x" :y2="touch.y"
            )
          g(:transform="`translate(${touch.x} ${touch.y})`")
            circle(
              r="2"
              :fill="isDark ? '#fff3': '#3333'"
              )
            text.fill-white.text-2px(
              y="-4"
            ) {{ touch.angle.toFixed() }}&deg; , {{ touch.distance.toFixed(2) }}
    
</template>

<style lang="postcss" scoped>
.center {
  @apply transition-all duration-200 ease-in-out;
}
</style>