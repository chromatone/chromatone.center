<script setup>
import { pitchColor } from '#/use';
import { useSynth } from './useSynth'

const { controls, groups, started, render, voices } = useSynth()

</script>

<template lang="pug">
button.text-button(v-if="!started" @click="render(); started = true") RENDER 

.flex.flex-col.gap-4(v-else)
  button.text-button(@mousedown="controls['osc:playing'] = 1" @mouseup="controls['osc:playing'] = 0") Play

  .flex.gap-1
    .p-1.flex-1.rounded-xl(v-for="voice in voices" :key="voice" :style="{ backgroundColor: pitchColor(voice.midi - 3, 3, voice.gate ? 1 : 0) }")

  .flex.flex-wrap.gap-2.is-group.p-2(v-for="(group, g) in groups" :key="group")
    ControlRotary(v-for="(param, p) in group" v-model="controls[`${g}:${p}`]" :min="param.min" :max="param.max" :step="param.step" :param="p")

  AudioAnalysisFFT

</template>
