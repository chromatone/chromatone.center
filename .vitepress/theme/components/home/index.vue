<script setup lang="ts">
import { pages } from '#theme/composables/pages'
</script>

<template lang="pug">
main.home(aria-labelledby="main-title")
  .noise
  //- header.home-hero.mt-16
    .w-full.max-w-600px.m-auto.p-4.opacity-20
      figure(
        v-if="$frontmatter?.icon"
        )
        img.block.w-auto(
          :src="$frontmatter.icon", 
          :alt="$frontmatter.heroAlt"
          )
  content.content.z-2
  .flex.flex-col.max-w-65ch.mx-auto
    home-tile-item(
      v-for="(area, i) in pages['/']", 
      :key="area.title", 
      :item="area", 
      :i="i",
      :total="pages['/'].length",
      )  
</template>

<style scoped >
.home {
  @apply w-full relative pb-16 flex flex-col items-stretch bg-light-500 dark_(bg-dark-500) transition-all duration-600 ease-out;
}

.noise {
  @apply w-full h-full absolute pointer-events-none z-0;
  background: linear-gradient(to top, hsla(0, 0%, 50%, 1), transparent),
    url(/img/noise.svg);
  opacity: 0.2;
  filter: contrast(100%) grayscale(100%);
}
</style>
