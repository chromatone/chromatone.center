<script setup>
import { midi } from '#/use/midi'
import { tempo } from '#/use/tempo'
import { getCircleCoord } from "#/use/calculations";
import { levelColor } from "#/use/colors";
import { ref, computed, watch, reactive } from 'vue'
import { wheels } from './state'
import { useDrag } from '@vueuse/gesture';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';
import { useSequence } from '#/use/index';

const props = defineProps({
  order: { type: Number, default: 0 },
  total: { type: Number, default: 1 },
  maxNum: { type: Number, default: 64 }
})

const allSteps = new Array(props.maxNum).fill(false).map((s, i) => ({ num: i, active: s }))

const wheel = reactive({
  radius: computed(() => (450 / props.total) * props.order)
})

const radius = computed(() => (250 + (props.order) * 250 / props.total))


const { seq, meter, steps, mutes, progress } = useSequence({ over: 8, under: 8, sound: props.order == 1 ? 'A' : 'E', volume: 1 }, props.order, 'wheel')

let dragger = meter.over
function drag({ delta }) {
  dragger += (delta[0] - delta[1]) / 20
  meter.over = Math.floor(dragger)
}
</script>

<template lang='pug'>
g.wheel(
  @dblclick="mutes.fill(mutes[0] ? true : false)"
  :transform="`rotate(${-progress*360})`")

  g.sector(v-for="(step,s) in steps" :key="step" )
    svg-ring(
      :cx="0"
      :cy="0"
      @click="mutes[s]= !mutes[s]"
      :from="s / meter.over * 360"
      :to="(s + 1) / meter.over * 360"
      :fill="levelColor(s+(tempo.pitch / 12) * meter.over,meter.over,1,!mutes[s] ? 1:0.2)"
      :radius="radius"
      :thickness="250/total"
      )
  svg-ring(
    :cx="0"
    :cy="0"
    v-drag="drag"
    :from="0"
    :to="359.9"
    fill="gray"
    :radius="radius"
    :thickness="50"
    )
  line( 
    :y1="-450/total*(order)"
    :y2="-450/total*(order+1)"
    stroke="currentColor"
    stroke-width="4"
  )

  //- text(fill="currentColor" x="0" :y="order*30+40") {{ seq }}
</template>