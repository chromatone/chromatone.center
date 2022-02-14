<template lang="pug">
.flex.flex-wrap.m-1
  .btn(
    v-for="(title,variant) in variants"
    :key="variant"
    @click="setVariant(variant)"
    :class="{ active: modelValue == variant }"
  ) {{ title }}
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: [String, Number]
  },
  variants: {
    type: Object,
    default: { one: '1', two: '2' }
  },
});

const emit = defineEmits(['update:modelValue']);

function setVariant(variant) {
  emit('update:modelValue', variant)
}
</script>

<style scoped>
.btn {
  @apply cursor-pointer flex place-items-center p-2 border-2 border-dark-100/50 dark_(border-light-100/50);
}

.btn.active {
  @apply bg-dark-100/50 dark_(bg-light-100/50);
}

.btn:first-child {
  border-radius: 8px 0 0 8px;
}

.btn:last-child {
  border-radius: 0 8px 8px 0;
}
</style>