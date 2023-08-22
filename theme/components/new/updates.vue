<script setup>
import { computed } from 'vue';

import { useRoute, useData } from 'vitepress'
import { data } from '../../../content/pages.data'
import { cleanLink, usePages, usePage } from 'vitepress-pages'

const route = useRoute();
const { routes } = usePages(route, data)


const recent = computed(() => {
  let all = routes.filter(el => el?.frontmatter.title && !el?.frontmatter.hidden)
  let sorted = [...all].sort((a, b) => {
    if (a?.frontmatter?.date < b?.frontmatter?.date) {
      return 1
    } else {
      return -1
    }
  })
  return sorted.splice(0, 12)
});
</script>

<template lang="pug">
.flex.flex-col.mx-4.items-center
  .max-w-60ch
    .text-xl Recent updates
    card-list(:rows="recent")
</template>

<style lang="postcss" scoped></style>