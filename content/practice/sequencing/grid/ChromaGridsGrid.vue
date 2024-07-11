<script setup>
import { noteColor } from "#/use/colors"
import { notes } from '#/use/theory'
import { useLoop } from '#/use/loop'
import { reactive } from 'vue';
import ChromaGridsColumn from "./ChromaGridsColumn.vue";

const props = defineProps({
  order: { type: Number, default: 0, },
  color: { type: String, default: 'currentColor', },
  active: { type: Boolean, default: true, },
});



const grid = reactive({
  width: 1000,
  height: 720,
  footer: 60,
})

defineEmits(['del']);

const loop = useLoop(props.order);


</script>

<template lang="pug">
.flex.flex-col.shadow-xl.rounded-3xl.overflow-hidden.border-4(
  :style="{ zIndex: active ? 100 : 1, opacity: active ? 1 : 0.25, borderColor: color, }"
)
  .flex.flex-wrap.p-2(
    :style="{ opacity: active ? 1 : 0, backgroundColor: color, pointerEvents: active ? 'auto' : 'none' }"
  )
    .is-group.flex.p-1.mx-1.items-center

      control-change.w-5em(
        v-model="loop.metre.over"
        :step="1"
        :min="1"
        :max="48"
        param=""
      )
      .p-2.text-xl /
      control-change.w-5em(
        v-model="loop.metre.under"
        :step="1"
        :min="1"
        :max="16"
        param=""
      )
    .is-group.flex.p-1.m-1
      button.text-button(@click="loop.rotate(-1)")
        .i-la-angle-left
      button.text-button(@click="loop.rotate()")
        .i-la-angle-right
    .is-group.p-1.flex.mx-1.transition-all.duration-300.ease(
      :style="{ borderColor: noteColor(loop.pitch, loop.octave) }"
    )
      control-change.w-5em(
        v-model="loop.octave"
        :step="1"
        :min="0"
        :max="7"
        :ratio="4"
        )
          .font-bold.transition-all.duration-300.ease(:style="{ color: noteColor(loop.pitch, loop.octave) }") {{ notes[loop.pitch] }}{{ loop.octave }}
    .is-group.p-1.flex.mx-1
      control-change.w-5em(
        v-model="loop.probability"
        :step="0.01"
        :min="0"
        :max="1"
        :fixed="2"
      )
        .i-la-dice.text-xl
      control-change.w-4em(
        v-model="loop.pan"
        :step="0.01"
        :min="-1"
        :max="1"
        :fixed="1"
        :ratio="2"
      )
        .i-mdi-pan-horizontal
      control-change.w-4em(
        v-model="loop.volume"
        :step="0.01"
        :min="0"
        :max="1"
        :fixed="1"
        :ratio="2"
        @dblclick="loop.volume > 0 ? loop.volume = 0 : loop.volume = 0.75"
      )
        .i-la-volume-up
    .flex-1
    button.text-button(@mousedown="loop.clear()")
      .i-la-trash-alt
    button.text-button(@mousedown="$emit('del')")
      .i-la-times
  svg.w-full.cursor-pointer(
    ref="svg"
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 ${grid.width} ${grid.height + grid.footer}`",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    :opacity="loop.volume"
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
          v-for="beat in loop.metre.over" 
          :key="beat"
          :y2="grid.height"
          :stroke-width="beat % loop.metre.under == 0 ? 8 : beat % 4 == 0 ? 4 : active ? 1 : 0"
          :stroke="color"
          :transform="`translate(${beat * grid.width / loop.metre.over} 0)`"
        )
        line(
          x2="1000"
          :transform="`translate(0 ${grid.height / 2})`"
          stroke-width="4"
          :stroke="noteColor(loop.pitch)"
        )

      chroma-grids-column(
        v-for="(step, s) in loop.steps" 
        :key="s"
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
