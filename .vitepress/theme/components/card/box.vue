<template lang="pug">
.block
  slot(:color="color")
</template>

<script setup>
import { lchToHsl } from '@use/colors.js'
const props = defineProps({
  i: {
    type: Number,
    default: 4,
  },
  total: {
    type: Number,
    default: 12
  },
  height: {
    type: Number,
    default: 6
  },
  borderWidth: {
    type: Number,
    default: 2
  }
});

const rowColor = lchToHsl(props.i, props.total);
const color = computed(() => lchToHsl(props.i, props.total));
const shadow = computed(() => `0 0 0 ${props.borderWidth}px ${color.value}, 0 ${props.height}px 0 2px ${color.value}`);
const hoverShadow = computed(() => `0 0 0 ${props.borderWidth}px ${color.value}, 0 ${props.height * 2}px 0 4px ${color.value}`);
</script>

<style scoped>
.block {
  @apply rounded-sm transition-all duration-150;
  box-shadow: v-bind(shadow);
  &:hover {
    box-shadow: v-bind(hoverShadow);
  }
}
</style>