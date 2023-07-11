<script setup>
import OscilloScope from "./OscilloScope.vue";
import { useMic } from "./useMic";

const mic = useMic()
</script>

<template lang='pug'>
.is-group.flex.items-center
  button.text-button(@click="mic.isOpen = !mic.isOpen" :class="{['text-red-500']:mic.isOpen}") {{ mic.isOpen ? 'Close' : 'Open' }} mic
  OscilloScope(name="mic")
</template>