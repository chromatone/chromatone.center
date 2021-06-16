<template lang="pug">
.flex.flex-wrap
  .flex-1(v-for="page in getParents($frontmatter.tags, site.customData.pages.all)", :key="page.title") 
    a.flex.items-center(:href="page.link") 
      carbon-arrow-up.mr-1
      span {{ page.title }}
</template>

<script setup>
import { useData } from 'vitepress'
const { site, title, theme } = useData()

function getParents(tag, all) {
  let parents = [];
  all.forEach(page => {
    if (tag && typeof tag == 'string' && tag == page.data?.list) {
      parents.push(page)
    }
  })
  return parents
}
</script>

<style  scoped>
</style>