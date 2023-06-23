<script setup>

import { useElemSynth } from './useElemSynth'

const { elemOptions } = useElemSynth()

</script>

<template lang='pug'>
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded
  .text-2xl.p-2 Elementary
  control-rotary(
    :step="0.001"
    v-model="elemOptions.volume"
    :max="1"
    param="Vol"
  )
  pre {{ elemOptions }}

</template>