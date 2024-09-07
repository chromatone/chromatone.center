<script setup>
import { useMidi } from "#/use/midi";
const { inputs } = useMidi();

</script>

<template lang="pug">
.flex.flex-wrap.gap-4.justify-center.p-4

  midi-router-input(
    v-for="(input, iid) in inputs"
    :key="iid"
    :input="input" 
    :iid="iid"
    )
</template>

<style lang="postcss" scoped></style>
