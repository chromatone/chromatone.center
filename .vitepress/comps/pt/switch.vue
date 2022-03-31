<script setup>
const props = defineProps({
  label: String,
  state: Boolean,
});
</script>

<template lang="pug">
.button
  .indicator.mr-2(:style="{ color: state ? '#fff' : '#333' }") ●
  .uppercase.mr-1 {{ label }}
</template>

<style lang="postcss" scoped>
.button {
  @apply flex py-1 px-2 text-xs font-bold mr-2 shadow bg-gray-300 rounded-xl cursor-pointer select-none transition items-center
  dark_(bg-gray-800)  
  hover_shadow-lg;
}
</style>