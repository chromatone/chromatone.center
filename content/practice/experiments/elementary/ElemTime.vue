<script setup lang="ts">
import { useTempo } from './useElemTime'

const { tempo } = useTempo()
</script>

<template lang='pug'>
.is-group.flex.flex-wrap 
  .p-2 {{ tempo.clock }}
  .p-2 {{ tempo.phasor }}
</template>