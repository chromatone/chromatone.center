<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { notes } from '#/use/theory';
import { useData } from 'vitepress'

import { guessChords, playNote, stopNote } from '#/use';
import ChromaTouchSector from './ChromaTouchSector.vue';

const { isDark } = useData()

const octaves = ref(4)
const startOctave = ref(1)
const box = { pad: 2, r: 50 }
const svg = ref()

const touches = reactive({})

const voices = computed(() => {
  const list = {}
  for (let t in touches) {
    const { angle, distance } = touches[t]
    const pitch = Math.ceil((angle - 15) / 30) % 12
    const octave = Math.floor((1 - distance) * octaves.value + startOctave.value - 2)
    const num = (octave + 4) * 12 + pitch - 3
    list[t] = { pitch, octave, num }
  }
  return list
})

function getPoint({ clientX, clientY }) {
  const point = svg.value.createSVGPoint()
  point.x = clientX
  point.y = clientY
  let { x, y } = point.matrixTransform(svg.value.getScreenCTM().inverse())
  return {
    x,
    y,
    angle: 180 * (Math.PI - Math.atan2(x, y)) / Math.PI,
    distance: Math.hypot(x, y) / box.r,
  }
}

function handleMouse(ev) {
  if (ev.type == 'mousedown') {
    touches['mouse'] = getPoint(ev)
  } else if (['mouseup', 'mouseleave', 'mouseout'].includes(ev.type)) {
    delete touches['mouse']
  } else if (touches['mouse'] && ev.type == 'mousemove') {
    touches['mouse'] = getPoint(ev)
  }
}

function handleTouch(ev) {
  for (let touch of ev.changedTouches) {
    if (['touchend', 'touchcancel'].includes(ev.type)) {
      delete touches[touch.identifier]
    } else {
      touches[touch.identifier] = getPoint(touch)
    }
  }
}

watch(voices, (vs, prev) => {
  for (let v in vs) {
    if (vs[v]?.num != prev[v]?.num) {
      playNote(notes[vs[v]?.pitch] + (vs[v]?.octave + (vs[v]?.pitch >= 3 ? 4 : 3)))
    }
  }
  nextTick(() => {
    for (let p in prev) {
      if (prev[p]?.num != vs[p]?.num) {
        stopNote(notes[prev[p]?.pitch] + (prev[p]?.octave + (prev[p]?.pitch >= 3 ? 4 : 3)))
      }
    }
  })


})

</script>

<template lang="pug">
svg.select-none.touch-action-none.max-h-full(
  ref="svg"
  version="1.1",
  baseProfile="full",
  :viewBox="`${-box.r - box.pad} ${-box.r - box.pad} ${box.r * 2 + 2 * box.pad} ${box.r * 2 + 2 * box.pad}`",
  xmlns="http://www.w3.org/2000/svg",
  style="touch-action:none; -webkit-user-select: none !important;  -webkit-touch-callout: none;"
  font-family="Commissioner, sans-serif"
  text-anchor="middle",
  dominant-baseline="middle"
  @touchstart="handleTouch"
  @touchmove="handleTouch"
  @touchend="handleTouch"
  @touchcancel="handleTouch"
  @mouseenter="handleMouse"
  @mousemove="handleMouse"
  @mousedown="handleMouse"
  @mouseup="handleMouse"
  @mouseleave="handleMouse"
  )
  g.octaves
    g.octave.op-90(v-for="(_, octave) in octaves" :key="octave")
      g(v-for="(note, n) in notes" :key="note")
        ChromaTouchSector(:n :note :octave :octaves :start-octave :size="box.r")

    g.touches
      g.touch(v-for="(touch, t) in touches" :key="t")
        line(
          stroke-linecap="round"
          :stroke="`hsl(${touch.angle}deg, 50%,50%)`"
          :x2="touch.x" :y2="touch.y"
          )
        g(:transform="`translate(${touch.x} ${touch.y})`")
          circle(
            r="2"
            :fill="isDark ? '#fff3' : '#3333'"
            )

  text.fill-black.text-6px {{ guessChords?.[0] }}
</template>

<style lang="postcss" scoped>
.center {
  @apply transition-all duration-200 ease-in-out;
}
</style>