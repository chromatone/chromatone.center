<template lang="pug">
main.mb-16(aria-labelledby="main-title")
  home-hero
  content.content
  home-tile-list(
    v-if="frontmatter.list", 
    :rows="site.customData.pages?.[frontmatter.list]"
    )
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
const { site, frontmatter } = useData()
</script>

<style scoped >
</style>
