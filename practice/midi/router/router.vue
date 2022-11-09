<script setup>
import midiInput from './input.vue'
import { useMidi } from "#/use/midi.js";
const { midi } = useMidi();

</script>

<template lang="pug">
.flex.flex-wrap.gap-4.justify-center
  midi-input(
    :input="input"
    :iid="iid"
    v-for="(input, iid) in midi.inputs" 
    :key="iid"
    )
</template>

<style lang="postcss" scoped>

</style>
