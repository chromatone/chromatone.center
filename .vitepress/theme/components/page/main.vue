<template lang="pug">
main.bg
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
.bg {
  @apply bg-light-600 dark:(bg-dark-600) transition-all duration-600 ease-out;
}
.content-container {
  @apply flex flex-col flex-1 items-stretch;
}
</style>
