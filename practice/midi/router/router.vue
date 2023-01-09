<script setup>
import midiInput from './input.vue'
import { useMidi } from "#/use/midi.js";
const { midi } = useMidi();

</script>

<template lang="pug">
.flex.flex-wrap.gap-4.justify-center
  midi-input(
    v-for="(input, iid) in midi.inputs"
    :key="iid"
    :input="input" 
    :iid="iid"
    )
</template>

<style lang="postcss" scoped>

</style>
