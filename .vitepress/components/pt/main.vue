<template lang="pug">
.flex
  .flex.flex-col.w-full.flex-auto
    pt-control-row
    pt-table
  .scroll-bar 
</template>
  
<script setup>

</script>
  
<style scoped>
.scroll-bar {
  @apply bg-gray-200 dark:bg-gray-500;
  background-image: linear-gradient(
    0deg,
    transparent 80%,
    hsla(0, 0%, 0%, 0.2) 20%
  );
  background-blend-mode: multiply;
  background-size: 20px 4px;
}
</style>
  