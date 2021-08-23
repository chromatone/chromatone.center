<template lang="pug">
.m-1.flex.justify-center
  .key(
    v-for="key in keys.notes"
    :key="key + chroma"
    :class="{ black: key.pos == 1, tonic: key.pitch == pitch }"
    @mouseover="key.active = true"
    @mouseleave="key.active = false"
    @click="emit('update:pitch', key.pitch)"
    :style="{ backgroundColor: isInChroma(key.pitch) || key.active || key.pitch == pitch ? pitchColor(key.pitch, key.pitch == pitch ? 4 : 3) : '' }" 
  ) {{ names ? key.name : '' }}
</template>

<script setup>
import { notes, rotateArray, pitchColor } from 'chromatone-theory'
const emit = defineEmits(['update:pitch']);
const props = defineProps({
  pitch: {
    type: Number,
    default: 0
  },
  chroma: String,
  size: {
    type: String,
    default: '2'
  },
  names: Boolean,
});
const keys = reactive({
  notes: rotateArray(notes, 3),
});

function isInChroma(pitch) {
  if (props.chroma) {
    let steps = rotateArray(props.chroma.split(''), -props.pitch)
    return steps[pitch] == 1
  }
}
</script>

<style scoped>
.key {
  @apply cursor-pointer flex justify-center items-end bg-white z-1 text-sm font-bold shadow rounded transition-all duration-200;
  padding: 1em 0.5em;
  flex: 1;
  &.black {
    @apply -mx-1.2 bg-gray-300 dark:(bg-gray-700) z-2;
    padding: 0.5em;
    margin-bottom: 1em;
  }
  &:hover {
    @apply shadow-lg;
  }
}
</style>