<script setup lang="ts">
import { useRoute } from 'vitepress'

const route = useRoute()
</script>

<template lang="pug">
main
  page-header
  transition(name="fade")
    .content-container(:key="route.path")
      content.content.flex-1
      shop-message
      row-list.mb-32
  nav-next-prev
  //- footer-row
</template>

<style lang="postcss" scoped>
main {
  flex: 1 1 70%;
  @apply flex flex-col;
  justify-content: stretch;
}

.content-container {
  @apply flex flex-col flex-1 items-stretch;
}
</style>
