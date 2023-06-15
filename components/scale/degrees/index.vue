<script setup>
import { useStorage } from '@vueuse/core';
import { reactive } from 'vue'
const state = reactive({
  chroma: useStorage('degrees-chroma', '101011010100'),
});
</script>

<template lang="pug">
.flex.flex-col.items-center.max-w-60ch.mx-auto.w-full
  scale-degrees-circle(
    v-model:chroma="state.chroma"
  )
  chroma-row(
    v-model:chroma="state.chroma"
  )
</template>

<style lang="postcss" scoped></style>