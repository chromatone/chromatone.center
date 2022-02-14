<script setup>
import { useMidi } from '@use/midi.js'
const { midi, midiAttack, midiRelease, setCC } = useMidi();
</script>

<template lang='pug'>
.flex.flex-col 
  .flex
    .p-4.shadow-lg.rounded-2xl
      .text-xl.font-bold Inputs
      .p-2(v-for="(input, id) in midi.inputs" :key="id") 
        .text-md {{ input.manufacturer }}
        .text-xl.font-bold {{ input.name }}
        .flex.flex-col
          .p-2(v-for="(output, id) in midi.inputs" :key="id") {{ output }}
</template>