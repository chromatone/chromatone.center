<script setup>
import { useMic } from '#/use/elementary/useMic';


const mic = useMic()
</script>

<template lang='pug'>
.is-group.flex.items-center
  button.text-button(@click="mic.isOpen = !mic.isOpen" :class="{ ['text-red-500']: mic.isOpen }") {{ mic.isOpen ? 'Close' : 'Open' }} mic
  ControlRotary(param="GAIN" v-model="mic.gain.value" :min="0" :max="10" :step="0.1")
  AudioAnalysisScope(name="mic")
</template>