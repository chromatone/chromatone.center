<template lang="pug">
.button
  .indicator.mr-2(:style="{ color: state ? '#fff' : '#333' }") ●
  .uppercase.mr-1 {{ label }}
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  label: String,
  state: Boolean,
});
</script>

<style  scoped>
.button {
  @apply flex py-1 px-2 text-xs font-bold mr-2 shadow bg-gray-300 rounded-xl cursor-pointer select-none transition
  dark:(bg-gray-800)  
  hover:shadow-lg;
}
</style>