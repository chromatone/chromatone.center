<script setup>
import { computed } from 'vue';

const props = defineProps({
  color: String,
  progress: Number,
  size: { type: Number, default: 10 },
  stroke: { type: Number, default: 2 }
})


const radius = computed(() => props.size / 2 - 1)

const length = computed(() => radius.value * Math.PI * 2)

</script>

<template lang="pug">
svg(version="1.1" baseProfile="full" :viewBox="`${-size / 2} ${-size / 2} ${size} ${size}`" xmlns="http://www.w3.org/2000/svg" :stroke-width="stroke")
  circle(:r="radius" fill="none" :stroke="color" transform="rotate(-90)" :style="{ strokeDasharray: `${length / 2}, ${length / 2}`, strokeDashoffset: 1.5 * length - (progress * length) }")
</template>