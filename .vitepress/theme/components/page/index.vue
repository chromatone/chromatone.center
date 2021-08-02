<template lang="pug">
main
  page-header
  .content-container
    content.content
    shop-message
    page-list.mb-32

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
  @apply flex flex-col  bg-light-500 dark:(bg-dark-500);
  -webkit-backdrop-filter: blur(70px);
  backdrop-filter: blur(70px);
}
</style>
