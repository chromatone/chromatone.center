<script setup lang="ts">
import { midi } from '#/use/midi'
import { tempo } from '#/use/tempo'
import { tracks } from '#/use/sequence'
import { getCircleCoord } from "#/use/calculations";
import { levelColor } from "#/use/colors";
import { ref, computed, watch, reactive } from 'vue'
import { wheels } from './state'
import { useDrag } from '@vueuse/gesture';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import { useSequence } from '#/use';

const props = defineProps({
  order: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
  maxNum: { type: Number, default: 64 }
})

const allSteps = new Array(props.maxNum).fill(false).map((s, i) => ({ num: i, active: s }))

const wheel = reactive({
  radius: computed(() => (450 / props.total) * props.order)
})


const { seq } = useSequence({ over: 8, under: 8, sound: props.order == 1 ? 'A' : 'E', volume: 1 }, props.order, 'wheel')

let dragger = seq.meter.over
function drag({ delta }) {
  dragger += (delta[0] - delta[1]) / 20
  seq.meter.over = Math.floor(dragger)
}
</script>

<template lang='pug'>
g.wheel(@dblclick="seq.mutes.fill(seq.mutes[0] ? true : false)")
  g.sector(v-for="(step,s) in seq.steps" :key="step" :transform="`rotate(${-seq.progress*360})`")
    svg-ring(
      :cx="0"
      :cy="0"
      @click="seq.mutes[s]= !seq.mutes[s]"
      :from="s / seq.meter.over * 360"
      :to="(s + 1) / seq.meter.over * 360"
      :fill="levelColor(s,seq.meter.over,1,!seq.mutes[s] ? 1:0.2)"
      :radius="450 - order*450/total"
      :thickness="450/total"
    )
  svg-ring(
    :cx="0"
    :cy="0"
    v-drag="drag"
    :from="0"
    :to="359.9"
    fill="gray"
    :radius="450 - order*450/total"
    :thickness="80"
    )
  //- text(fill="currentColor" x="0" :y="order*30+40") {{ seq }}
</template>