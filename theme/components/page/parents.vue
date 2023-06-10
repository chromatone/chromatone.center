<script setup>
import { useRoute } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, useParents } from 'vitepress-pages'

const route = useRoute()
const parents = useParents(route, data)
</script>

<template lang="pug">
.tabs
  a.link(
    v-for="page in parents", 
    :key="page.url" 
    :href="page.url") 
    .i-carbon-chevron-left.mr-1
    span {{ page?.frontmatter?.title }}
</template>
  
<style lang="postcss" scoped>
.tabs {
  @apply -mt-2 inline-flex flex-wrap items-stretch justify-start;
}

.link {
  @apply transition-all rounded-xl mr-1 duration-500 no-underline text-lg flex items-center p-2 bg-light-300/70 dark-(bg-dark-100/70) hover-(bg-light-100 dark-bg-dark-100);
  flex: 0 1 auto;
}
</style>