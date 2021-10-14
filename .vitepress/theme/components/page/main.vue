<template lang="pug">
transition(name="fade")
  main(:key="route.path")
    page-header
    .content-container
      content.content
      shop-message
      row-list.mb-32
    page-next-prev
    footer-row
</template>

<script setup lang="ts">
import { useRoute } from 'vitepress'

const route = useRoute()

</script>

<style  scoped>
main {
  flex: 1 1 70%;
  @apply flex flex-col;
}
.content-container {
  @apply flex flex-col rounded-xl items-stretch bg-light-600 dark:(bg-dark-600);
}
</style>
