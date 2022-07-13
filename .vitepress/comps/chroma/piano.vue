<script setup>
import { rotateArray, pitchColor } from '#use/calculations'
import { notes } from '#use/theory'
import { globalScale } from '#use/chroma'

const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i }))

const emit = defineEmits(['update:pitch']);
const props = defineProps({
  pitch: {
    type: Number,
    default: 0
  },
  chroma: {
    type: String,
    default: '100010010000'
  },
  size: {
    type: String,
    default: '2'
  },
  names: Boolean,
});

const keys = reactive({
  notes: rotateArray(allNotes, 3),
  tonic: computed(() => props.pitch || globalScale.tonic),
  steps: computed(() => rotateArray(props.chroma.split(''), -keys.tonic))
});

function isInChroma(pitch) {
  if (props.chroma) {
    let steps = rotateArray(props.chroma.split(''), -globalScale.tonic)
    return steps[pitch] == 1
  }
}
</script>

<template lang="pug">
.flex.justify-center.min-h-2rem
  .key(
    v-for="key in keys.notes"
    :key="key"
    :class="{ black: key.name.length == 2, tonic: key.pitch == pitch }"
    @mouseover="key.active = true"
    @mouseleave="key.active = false"
    @click="globalScale.tonic = key.pitch"
    :style="{ backgroundColor: keys.steps[key.pitch] == 1 || key.active || key.pitch == globalScale.tonic ? pitchColor(key.pitch, 4, key.pitch == globalScale.tonic ? 1 : 0.4) : '' }" 
  ) {{ names ? key.name : '' }}
</template>

<style lang="postcss" scoped>
.key {
  @apply cursor-pointer flex justify-center items-end bg-white z-1 text-sm font-bold shadow rounded transition-all duration-200 opacity-100;
  padding: 2em 1em;
  margin-top: 0.2em;
  margin-bottom: 1em;
  flex: 1;

  &.black {
    @apply bg-gray-300 dark_(bg-gray-700) z-2;
    padding: 1em 1em;
    margin-left: -1.5em;
    margin-right: -0.2em;
    margin-bottom: 2.5em;
    transform: translateX(25%);
  }

  &.tonic {
    @apply opacity-100;
  }

  &:hover {
    @apply shadow-md;
  }
}
</style>