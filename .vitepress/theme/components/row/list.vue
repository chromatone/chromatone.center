<template lang="pug">
.list-blocks(v-if="rows")
  row-block(
    v-for="(area,i) in rows", 
    :key="area.title", 
    :item="area", 
    :i="i",
    :total="rows.length"
    )  
</template>

<script setup>
import { useData } from 'vitepress'
const { site, title, frontmatter } = useData()

const rows = site.value.customData.pages?.[frontmatter.value.list];

</script>

<style  scoped>
.list-blocks {
  @apply flex flex-col max-w-65ch mx-auto;
}
</style>
