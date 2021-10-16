<template lang="pug">
main
  page-header
  transition(name="fade")
    .content-container(:key="route.path")
      content.content
      shop-message
      row-list.mb-32
      page-next-prev
  //- footer-row
</template>

<script setup lang="ts">
import { useRoute, useData } from 'vitepress'
import { useParents } from '../../composables/links.js'

const route = useRoute()
const { theme } = useData()

const parents = useParents();

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
