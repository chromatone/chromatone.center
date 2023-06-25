<script setup>

import { midi } from '#/use';
import { useElemSynth } from './useElemSynth'


const { ctrl, voices } = useElemSynth()

</script>

<template lang="pug">
.p-4.bg-light-200.dark-bg-dark-200.shadow.rounded
  .text-2xl.p-2 Elementary
  control-rotary(
    :step="0.001"
    v-model="ctrl.volume"
    :max="1"
    param="Vol"
  )
  pre {{ ctrl }}

  button.text-button(@mousedown="ctrl.gate=1" @mouseup="ctrl.gate=0") PRESS TO PLAY A SOUND

  .text-xs(v-for="voice in voices" :key="voice") {{ voice }}

</template>