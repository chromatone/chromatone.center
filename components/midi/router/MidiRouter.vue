<script setup>
import { useMidi } from "#/use/midi";
const { midi } = useMidi();

</script>

<template lang="pug">
.flex.flex-wrap.gap-4.justify-center
  midi-router-input(
    v-for="(input, iid) in midi.inputs"
    :key="iid"
    :input="input" 
    :iid="iid"
    )
</template>

<style lang="postcss" scoped></style>
