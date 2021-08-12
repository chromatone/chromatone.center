<template lang="pug">
.m-1.flex.justify-center
  .key(
    v-for="key in keys.notes"
    :key="key"
    :class="{ black: key.pos == 1 }"
    @mouseover="key.active = true"
    @mouseleave="key.active = false"
    @click="emit('update:pitch', key.pitch)"
    :style="{ backgroundColor: key.active || key.pitch == pitch ? pitchColor(key.pitch) : '' }"
  )
</template>

<script setup>
import { notes, rotateArray, pitchColor } from 'chromatone-theory'
const emit = defineEmits(['update:pitch']);
const props = defineProps({
  pitch: {
    type: Number,
    default: 0
  }
});
const box = reactive({
  width: 800,
  height: 100,
  padX: 10,
  padY: 10,
});
const keys = reactive({
  notes: rotateArray(notes, 3),
});
</script>

<style scoped>
.key {
  @apply cursor-pointer p-3 bg-white z-1 text-sm font-bold shadow rounded transition-all duration-200;
  &.black {
    @apply p-2 mb-5 -mx-2 bg-gray-500 z-2;
  }
  &:hover {
    @apply shadow-lg;
  }
}
</style>