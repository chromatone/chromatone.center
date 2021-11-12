<template lang="pug">
main.home(aria-labelledby="main-title")
  .noise
  home-hero.z-2
  content.content.z-2
  home-tile-list.z-2(
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
  @apply w-full relative pb-16 flex flex-col items-stretch bg-light-500 dark:(bg-dark-500) transition-all duration-600 ease-out;
}
.noise {
  @apply w-full h-full absolute pointer-events-none z-0;
  background: linear-gradient(to top, hsla(0, 0%, 50%, 1), transparent),
    url(/img/noise.svg);
  opacity: 0.2;
  filter: contrast(100%) grayscale(100%);
}
</style>
