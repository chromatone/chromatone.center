<script setup>
const props = defineProps({
  order: {
    type: Number,
    default: 0,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  active: {
    type: Boolean,
    default: true,
  },
});

import { isDark } from '@theme/composables/state'
import { pitchColor, notes } from 'chromatone-theory'
import { useLoop } from './loop'
import { Frequency } from 'tone'

const grid = reactive({
  width: 1000,
  height: 500,
  footer: 60,
})

const emit = defineEmits(['del']);

const loop = useLoop(props.order);


</script>

<template lang="pug">
.flex.flex-col.shadow-xl.rounded-xl.border-4(
  :style="{ zIndex: active ? 100 : 1, opacity: active ? 1 : 0.25, borderColor: color, }"
)
  .flex.flex-wrap.p-2(
    :style="{ opacity: active ? 1 : 0, backgroundColor: color, pointerEvents: active ? 'auto' : 'none' }"
  )
    .is-group.flex.p-1.mx-1.items-center

      control-change.w-5em(
        v-model="loop.over"
        :step="1"
        :min="1"
        :max="48"
        param=""
      )
      .p-2.text-xl /
      control-change.w-5em(
        v-model="loop.under"
        :step="1"
        :min="1"
        :max="16"
        param=""
      )
    .is-group.flex.p-1.m-1
      button.text-button(@click="loop.rotate(-1)")
        la-angle-left
      button.text-button(@click="loop.rotate()")
        la-angle-right
    .is-group.p-1.flex.mx-1.transition-all.duration-300.ease(
      :style="{ borderColor: pitchColor(loop.pitch, loop.octave) }"
    )
      control-change.w-5em(
        v-model="loop.octave"
        :step="1"
        :min="0"
        :max="7"
        :ratio="4"
        )
          .font-bold.transition-all.duration-300.ease(:style="{ color: pitchColor(loop.pitch, loop.octave) }") {{ notes[loop.pitch].name }}{{ loop.octave }}
    .is-group.p-1.flex.mx-1
      control-change.w-5em(
        v-model="loop.probability"
        :step="0.01"
        :min="0"
        :max="1"
        :fixed="2"
      )
        la-dice.text-xl
      control-change.w-4em(
        v-model="loop.pan"
        :step="0.01"
        :min="-1"
        :max="1"
        :fixed="1"
        :ratio="2"
      )
        mdi-pan-horizontal
      control-change.w-4em(
        @dblclick="loop.volume > 0 ? loop.volume = 0 : loop.volume = 0.75"
        v-model="loop.volume"
        :step="0.01"
        :min="0"
        :max="1"
        :fixed="1"
        :ratio="2"
      )
        la-volume-up
    .flex-1
    button.text-button(@mousedown="loop.clear()")
      la-trash-alt
    button.text-button(@mousedown="$emit('del')")
      la-times
  svg.w-full.cursor-pointer(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 ${grid.width} ${grid.height + grid.footer}`",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    :opacity="loop.volume"
    ref="svg"
    )
    clipPath#grid-mask
      rect(
        :x="0", 
        :y="-10", 
        :width="grid.width", 
        :height="grid.height + grid.footer + 10",  
        :rx="10"
        )
    g.all(
      clip-path="url(#grid-mask)"
    )
      g.grid
        rect(
          ref="area"
          :stroke="color"
          :stroke-width="10"
          fill="transparent"
          rx="10"
          :width="grid.width"
          :height="grid.height"
        )
        line(
          v-for="beat in loop.over" :key="beat"
          :y2="grid.height"
          :stroke-width="beat % loop.under == 0 ? 8 : beat % 4 == 0 ? 4 : active ? 1 : 0"
          :stroke="color"
          :transform="`translate(${beat * grid.width / loop.over} 0)`"
        )
        line(
          x2="1000"
          :transform="`translate(0 ${grid.height / 2})`"
          stroke-width="4"
          :stroke="pitchColor(loop.pitch)"
        )

      pitch-grids-column(
        v-for="(step,s) in loop.steps" :key="s"
        :step="step"
        :pos="s"
        :color="color"
        :width="grid.width / loop.steps.length"
        :height="grid.height"
        :footer="grid.footer"
        :active="active"
        @subdivide="loop.steps[s] = $event"
      )
      g.progress(
        :transform="`translate(${grid.width * loop.progress} 0)`"
        )
        line(
          y1="0"
          :y2="grid.height"
          stroke-width="4"
          :stroke="color"
        )
</template>
