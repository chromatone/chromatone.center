<template lang="pug">
main
  page-header
  .content-container
    transition(name="fade")
      content.content
    shop-message
    row-list.mb-32

  page-next-prev
  footer-row
</template>

<script setup lang="ts">


</script>

<style  scoped>
main {
  @apply flex flex-col;
}
.content-container {
  @apply flex flex-col items-stretch bg-light-800 dark:(bg-dark-800);
}
</style>
