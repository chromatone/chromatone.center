<script setup>
</script>

<template lang="pug">
button.button
  slot Start
</template>

<style scoped>
.button {
  @apply cursor-pointer font-bold text-2xl transition-all duration-300 ease-in-out p-8 rounded-xl border-4 bg-light-800 shadow-xl text-black
  dark_(bg-dark-400 border-dark-100 text-white) hover_(shadow-2xl);
}
</style>