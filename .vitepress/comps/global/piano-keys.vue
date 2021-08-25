<template lang="pug">
.m-1.flex.justify-center.min-h-2rem
  .key(
    v-for="key in keys.notes"
    :key="key"
    :class="{ black: key.pos == 1, tonic: key.pitch == pitch }"
    @mouseover="key.active = true"
    @mouseleave="key.active = false"
    @click="emit('update:pitch', key.pitch)"
    :style="{ backgroundColor: isInChroma(key.pitch) || key.active || key.pitch == pitch ? pitchColor(key.pitch, 4, key.pitch == pitch ? 1 : 0.4) : '' }" 
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
  @apply cursor-pointer flex justify-center items-end bg-white z-1 text-sm font-bold shadow rounded transition-all duration-200 opacity-100;
  padding: 2em 1em;
  margin-top: 0.2em;
  flex: 1;
  &.black {
    @apply bg-gray-300 dark:(bg-gray-700) z-2;
    padding: 1.4em 1em;
    margin-left: -1.8em;
    margin-bottom: 1.6em;
    transform: translateX(50%);
  }
  &.tonic {
    @apply opacity-100;
  }
  &:hover {
    @apply shadow-md;
  }
}
</style>