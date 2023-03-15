<script setup>
import { useRoute } from 'vitepress'

const route = useRoute()
</script>

<template lang="pug">
main#content
  page-headline
  transition(name="fade")
    .content-container(:key="route.path")
      content.content.flex-auto.z-10
      shop-message
      row-list.mb-32.max-w-full
  nav-next-prev
  footer-row
</template>

<style lang="postcss" scoped>
main {
  flex: 1 1 70%;
  @apply flex flex-col;
  justify-content: stretch;
}

.content-container {
  @apply flex flex-col p-0 sm-p-4 flex-1 items-stretch bg-light-400 dark-bg-dark-400;
}
</style>
