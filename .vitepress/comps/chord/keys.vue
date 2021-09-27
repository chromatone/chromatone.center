<template lang="pug">
p keys
</template>

<script setup>
const props = defineProps({
  chroma: {
    type: String,
    default: '100010010000'
  },
  pitch: {
    type: String,
    default: 0
  }
});

import { globalScale } from '@use/theory.js'

const keys = reactive({
  tonic: computed(() => props.pitch || globalScale.tonic),

});

</script>

<style scoped>
</style>