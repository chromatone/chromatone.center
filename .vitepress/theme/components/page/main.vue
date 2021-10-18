<template lang="pug">
main
  page-header
  transition(name="fade")
    .content-container(:key="route.path")
      content.content.flex-1
      shop-message
      row-list.mb-32
  page-next-prev
  //- footer-row
</template>

<script setup lang="ts">
import { useRoute } from 'vitepress'

const route = useRoute()
</script>

<style  scoped>
main {
  flex: 1 1 70%;
  @apply flex flex-col;
  justify-content: stretch;
}
.content-container {
  @apply flex flex-col flex-1 rounded-xl items-stretch bg-light-600 dark:(bg-dark-600);
}
</style>
