<template lang="pug">
.btn(
  :class="{ active: modelValue }"
  @mousedown="setValue(true)"
  @mouseup="setValue(false)"
  @mouseleave="setValue(false)"
  @touchstart="setValue(true)"
  @touchend="setValue(true)"
  @touchcancel="setValue(false)"
) {{ title }}
</template>

<script setup>
import { defineProps, defineEmit } from 'vue'
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'BTN'
  }
});

const emit = defineEmit(['update:modelValue'])

function setValue(val) {
  emit('update:modelValue', val)
}


</script>

<style scoped>
.btn {
  @apply p-2 border-1 text-center flex place-items-center rounded-lg m-1 select-none cursor-pointer;
}
.btn.active {
  @apply transition-all duration-200 bg-dark-100/50 dark:(bg-light-100/50);
}
</style>