<template lang="pug">
main.home(aria-labelledby="main-title")
  home-hero
  content.content
  home-tile-list(
    v-if="frontmatter.list", 
    :rows="theme.pages?.[frontmatter.list]"
    )
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
const { theme, frontmatter } = useData()
</script>

<style scoped >
.home {
  @apply pb-16 flex flex-col items-stretch bg-light-500 dark:(bg-dark-500);
}
</style>
