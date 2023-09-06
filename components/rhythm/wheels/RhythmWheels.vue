<script setup>
import { midi } from '#/use/midi'
import { tempo } from '#/use/tempo'
import { tracks } from '#/use/sequence'
import { getCircleCoord } from "#/use/calculations";
import { levelColor } from "#/use/colors";
import { ref, computed, watch, reactive } from 'vue'
import RhythmWheel from './RhythmWheel.vue';
import { wheels } from './state'
import CircleCenter from '../circle/CircleCenter.vue';

const numWheels = ref(2)


</script>

<template lang='pug'>
#screen.flex.flex-col.items-center.w-full.relative.pb-12.p-4.fullscreen-container.rounded-3xl
  svg#metronome.w-full.max-h-90vh(
    version="1.1",
    baseProfile="full",
    viewBox="-500 -500 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    )
    defs
      filter#shadowButton(
        x="-50%" 
        height="200%" 
        width="300%")
        feDropShadow(
          dx="0" 
          dy="3" 
          stdDeviation="3" 
          flood-color="#2225")

    rhythm-wheel(v-for="(_,w) in numWheels" :key="w" :order="w" :total="numWheels")

    line(
      :y2="-450" 
      stroke-width="4"
      stroke-linecap="round"
    stroke="currentColor"
    )
    CircleCenter
</template>