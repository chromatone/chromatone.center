<script setup lang="ts">
import { useElemAudio } from './useElemAudio';
import { useTempo } from './useElemTime'

const { tempo, controls } = useTempo()

const { meters } = useElemAudio()

</script>

<template lang='pug'>
.is-group.flex.flex-col
  .flex.flex-wrap.font-mono
    .p-2 {{ tempo?.timer }} samples,
    .p-2 {{ tempo?.sec?.toFixed() }}s,
    .p-2 {{ Math.round(100*meters?.['main:bpm']?.max)/100 }} BPM
  .flex.flex-wrap.gap-2
    ControlRotary(
      :min="30"
      :max="600"
      :step="0.5"
      v-model="controls['tempo:bpm']"
      param="BPM"
    )
</template>