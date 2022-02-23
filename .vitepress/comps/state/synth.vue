<script setup>
import { useSynth } from '@use/synth.js'

const { synthOnce } = useSynth();



</script>

<template lang="pug">
button.mute.p-2(@click="synthOnce()" aria-label="Test synth sound")
  la-wave-square
</template>

<style scoped>
.mute {
  font-size: 1.1em;
}
</style>