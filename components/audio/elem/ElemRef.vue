<script setup>
import { el } from '@elemaudio/core';
import { useAudio } from '../useAudio.js';
import { ref, watch } from 'vue';

import params from './params.json'

import { useParams } from './useParams.js';

const { audio, render } = useAudio()

const started = ref(false)

const { controls, cv } = useParams(params, 'ref')

watch(() => audio.initiated, () => {
  const saw = el.mul(cv['ref:volume'], el.blepsaw(cv['ref:frequency']))

  audio.layers.saw = {
    volume: .5,
    signal: [saw, saw]
  }
})

</script>

<template lang="pug">
p {{ controls }}
button.text-button(v-if="!started" @click="render(); started = true") RENDER 
.flex.flex-col.gap-4(v-else)
  .p-0 Synth {{ controls.freq }}
  input(type="range" v-model="controls['ref:frequency']" :min="30" :max="6000" )
  //- input(type="range" v-model="controls['ref:volume']" :min="0" :max="1" :step="0.01")
  ControlRotary( v-model="controls['ref:volume']" :min="0" :max="1" :step="0.01")
  AudioAnalysisFFT

</template>
