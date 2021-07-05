<template lang="pug">
.button
  slot Start
</template>

<script setup>
</script>

<style scoped>
.button {
  @apply cursor-pointer font-bold text-2xl transition-all duration-300 ease-in-out p-8 rounded-xl border-4 bg-light-800 shadow-xl
  dark:(bg-dark-400 border-dark-100) hover:(shadow-2xl);
}
</style>