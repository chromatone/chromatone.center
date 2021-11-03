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
  loop: {
    type: Object,
    default: {
      over: 4,
      under: 4,
      pitch: 0,
      octave: 2,
      sound: 'A',
      volume: 1,
    }
  },
});

import { isDark } from '@theme/composables/state.js'
import { pitchColor, notes } from 'chromatone-theory'
import { useGrid } from './grid.js'
import { Frequency } from 'tone'

const emit = defineEmits(['del', 'over', 'under', 'pitch', 'octave']);

const {
  progress,
  current,
  steps,
  volume,
  panning,
  clearGrid,
  probability,
} = useGrid(props.loop, props.order);

</script>

<template lang="pug">
.flex.flex-col.shadow-xl.rounded-xl.border-4(
  :style="{ zIndex: active ? 100 : 1, opacity: active ? 1 : 0.35, borderColor: color, }"
)
  .flex.flex-wrap.p-2(
    :style="{ opacity: active ? 1 : 0, backgroundColor: color, pointerEvents: active ? 'auto' : 'none' }"
  )
    .is-group.flex.p-1
      control-change.w-5em(
        :modelValue="loop.over"
        @update:modelValue="$emit('over', $event)"
        :step="1"
        :min="1"
        :max="48"
        param=""
      )
      .p-2.text-xl /
      control-change.w-5em(
        :modelValue="loop.under"
        @update:modelValue="$emit('under', $event)"
        :step="1"
        :min="1"
        :max="16"
        param=""
      )
    control-change.w-5em(
      v-model="probability"
      :step="0.01"
      :min="0"
      :max="1"
      :fixed="2"
      param="Prob"
    )
      la-dice.text-xl
    .is-group.p-1.flex.mx-1(
      :style="{ borderColor: pitchColor(loop.pitch) }"
    )
      control-change.w-5em(
      :modelValue="loop.pitch"
      @update:modelValue="$emit('pitch', $event)"
      :step="1"
      :min="0"
      :max="11"
      )
        .text-sm.text-white.font-bold(:style="{ color: pitchColor((loop.pitch) % 12) }") {{ notes[loop.pitch].name }}
      control-change.w-4em(
      :modelValue="loop.octave"
      @update:modelValue="$emit('octave', $event)"
      :step="1"
      :min="0"
      :max="7"
      :ratio="4"
      )
    .is-group.p-1.flex.mx-1
      control-change.w-4em(
        v-model="panning"
        :step="0.01"
        :min="-1"
        :max="1"
        :fixed="1"
        :ratio="2"
      )
        mdi-pan-horizontal
      control-change.w-4em(
        v-model="volume"
        :step="0.01"
        :min="0"
        :max="1"
        :fixed="1"
        :ratio="2"
      )
        la-volume-up
    .flex-1
    button.text-button(@mousedown="clearGrid()")
      la-trash-alt
    button.text-button(@mousedown="$emit('del')")
      la-times
  svg.w-full(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 1000 400`",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    :opacity="volume"
    ref="svg"
    )
    defs
      filter#shadowButton(x="-50%" height="200%" width="300%")
        feDropShadow(
          dx="0" dy="5" 
          stdDeviation="0" 
          :flood-color="color"
        )
    g.grid
      rect(
        ref="area"
        :stroke="color"
        :stroke-width="6"
        fill="transparent"
        rx="6"
        width="1000"
        height="400"
      )
      line(
        v-for="beat in loop.over" :key="beat"
        y2="400"
        :stroke-width="beat % loop.under == 0 ? 4 : active ? 3 : 1"
        :stroke="color"
        :transform="`translate(${beat * 1000 / loop.over} 0)`"
      )
      line(
        x2="1000"
        y1="190"
        y2="190"
        stroke-width="4"
        :stroke="pitchColor(loop.pitch)"
      )
    g.col(
      v-for="(step,s) in steps" :key="s"
      :transform="`translate(${s * 1000 / steps.length} 0)`"
    )
      g.cell(
        v-for="(cell,c) in 24" :key="c"
        :transform="`translate(0 ${400 - cell * 400 / 24})`"
      )
        rect.transition-all.duration-200.ease-out(
          :filter="step[0][c] && active ? 'url(#shadowButton)' : ''"
          class="stroke-0 hover:stroke-2"
          :stroke="pitchColor(cell + loop.pitch - 1, 3, 1, 1)"
          :width="1000 / steps.length"
          :height="400 / 24"
          rx="2"
          :fill="pitchColor(cell + loop.pitch - 1, 3, 1, step?.[0]?.[c] ? 1 : 0.1)"
          @mousedown="step[0][c] = !step[0][c]"
        )
    g.progress(
      :transform="`translate(${1000 * progress}   0)`"
      )
      line(
        y1="0"
        y2="400"
        stroke-width="4"
        :stroke="color"
      )
</template>
