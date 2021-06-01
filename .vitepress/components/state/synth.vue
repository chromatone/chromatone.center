<template lang="pug">
button.mute.p-2(@click="synthOnce()")
  la-wave-square
</template>

<script setup>
import { useSynth } from '@use/synth.js'

const { synthOnce } = useSynth();



</script>

<style scoped>
.mute {
  font-size: 1.1em;
}
</style>