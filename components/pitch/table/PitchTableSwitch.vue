<script setup>
defineProps({
  label: { type: String, default: '' },
  state: { type: Boolean, default: false },
});
</script>

<template lang="pug">
.button
  .indicator.mr-2(:style="{ color: state ? '#fff' : '#333' }") ●
  .uppercase.mr-1 {{ label }}
</template>

<style lang="postcss" scoped>
.button {
  @apply flex py-2 px-2 text-sm font-bold shadow bg-gray-300 rounded-xl cursor-pointer select-none transition items-center dark-(bg-gray-800) hover-shadow-lg;
}
</style>