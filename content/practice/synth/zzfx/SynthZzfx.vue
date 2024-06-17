<script setup>
import { useZZFX } from "./zzfx.js";


const { sound, limits } = useZZFX()


</script>

<template lang="pug">
.flex.flex-col.gap-gap-4ZZFX
  .flex.flex-wrap.is-group.p-4.m-4
    ControlRotary(v-for="(control, c) in limits" v-bind="control" v-model="sound[c]" :param="c")
  MidiKeys
</template>
