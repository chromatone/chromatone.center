<script setup>
import { useString } from '#/use/elementary/ref/useString.js';


const { controls, groups, audio, render, isRendered } = useString();
</script>

<template lang="pug">
button.p-40.text-2xl.font-bold.bg-light-900.dark-bg-dark-700(v-if="!audio.started" @click="render()") START 
.flex.flex-col.gap-6.p-2(v-else-if="isRendered")
  AudioAnalysisFFT
  .flex.flex-wrap.p-2.gap-4
    template(v-for="(params, group) in groups")
      .flex.flex-col.items-center(v-for="(param, name) in params")
        control-rotary(
          :param="name"
          v-model="controls[`${group}:${name}`]"
          :min="param.min"
          :max="param.max"
          :fixed="param.fixed"
          :step="param.step"
        )
  MidiKeys
.p-40.text-2xl.font-bold.bg-light-900.dark-bg-dark-700(v-else) Loading...
</template>