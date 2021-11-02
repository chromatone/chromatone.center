<script setup>
const props = defineProps({
  order: {
    type: Number,
    default: 0,
  },
  loop: {
    type: Object,
    default: {
      over: 4,
      under: 4,
      tonic: 69,
      sound: 'A',
      volume: 1,
    }
  },
});

import { isDark } from '@theme/composables/state.js'
import { pitchColor } from 'chromatone-theory'
import { useGrid } from '@use/grid'
import { Frequency } from 'tone'

const emit = defineEmits(['del', 'over', 'under', 'tonic']);

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
.flex.flex-col.shadow-xl.rounded-xl.m-2.p-2
  .flex.flex-wrap
    control-change(
      :modelValue="loop.over"
      @update:modelValue="$emit('over', $event)"
      :step="1"
      :min="1"
      :max="48"
      param="over"
    )
    control-change(
      :modelValue="loop.under"
      @update:modelValue="$emit('under', $event)"
      :step="1"
      :min="1"
      :max="16"
      param="under"
    )
    control-change.w-6em(
      v-model="probability"
      :step="0.01"
      :min="0"
      :max="1"
      :fixed="2"
      param="Prob"
    )
    control-change(
      :modelValue="loop.tonic"
      @update:modelValue="$emit('tonic', $event)"
      :step="1"
      :min="20"
      :max="100"
      param="root"
    )
      .text-sm.text-white.font-bold(:style="{ color: pitchColor((loop.tonic + 3) % 12) }") {{ Frequency(loop.tonic, 'midi').toNote() }}
    .flex-1
    button.text-button(@mousedown="clearGrid()")
      la-trash-alt
    button.text-button(@mousedown="$emit('del')")
      la-times
  svg.w-full(
    class="bg-light-300 dark:bg-dark-800"
    version="1.1",
    baseProfile="full",
    :viewBox="`-10 -10 1020 420`",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    :opacity="volume + 0.1"
    ref="svg"
    )
    defs
      filter#shadowButton(x="-50%" height="200%" width="300%")
        feDropShadow(
          dx="0" dy="3" 
          stdDeviation="3" flood-color="#2225"
        )
    g.grid
      rect(
        ref="area"
        stroke="currentColor"
        stroke-width="1"
        fill="transparent"
        rx="4"
        width="1000"
        height="400"
      )
      line(
        v-for="beat in loop.over" :key="beat"
        y2="400"
        :stroke-width="beat % loop.under == 0 ? 2 : 1"
        stroke="currentColor"
        :transform="`translate(${beat * 1000 / loop.over} 0)`"
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
          class="stroke-0 hover:stroke-2"
          :stroke="pitchColor(cell + loop.tonic + 2, 3, 1, 1)"
          :width="1000 / steps.length"
          :height="400 / 24"
          rx="2"
          :fill="pitchColor(cell + loop.tonic + 2, 3, 1, step?.[0]?.[c] ? 1 : 0.1)"
          @mousedown="step[0][c] = !step[0][c]"
        )
    g.progress(
      :transform="`translate(${1000 * progress}   0)`"
      )
      line(
        y1="0"
        y2="400"
        stroke-width="2"
        stroke="currentColor"
      )
  .flex.flex-wrap
    control-change.w-6em(
      v-model="panning"
      :step="0.01"
      :min="-1"
      :max="1"
      :fixed="1"
      param="PAN"
    )
    control-change.w-5em(
      v-model="volume"
      :step="0.01"
      :min="0"
      :max="1"
      :fixed="1"
      param="VOL"
    )
    .flex-1
    .p-2 
</template>
