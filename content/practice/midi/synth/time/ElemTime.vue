<script setup lang="ts">
import { useAudio } from '../audio/useAudio';
import { useTime } from './useTime'

const { controls, groups } = useTime()

const { meters } = useAudio()

</script>

<template lang='pug'>
.is-group.flex.flex-col
  .text-xs.p-2.gap-2.flex.flex-col
    .flex.flex-wrap.font-mono.gap-2
      .p-0 {{ meters?.['tempo:bpm']?.max?.toFixed(1) }} BPM,
      .p-0 {{ meters?.['tempo:bps']?.max?.toFixed(1) }} BPS,
      .p-0 {{ Math.round(meters?.['tempo:steps']?.max)}} steps
    .flex.flex-wrap.font-mono.gap-2
      .p-0 {{ meters?.['tempo:beats']?.max?.toFixed(1) }} beats,
      .p-0 {{ meters?.['tempo:measures']?.max?.toFixed(1) }} measures,
      .p-0 {{ (meters?.['tempo:progress']?.max * 100).toFixed() }}%

  .flex.flex-wrap.gap-2(v-for="(group,title) in groups" :key="title") 
    ControlRotary(
      v-for="(param, p) in group" :key="p"
      :min="param.min"
      :max="param.max"
      :step="param.step"
      v-model="controls[p]"
      :param="p"
      )
</template>