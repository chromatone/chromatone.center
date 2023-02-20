<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { pages } from '#/theme/composables/pages'

const { site, theme } = useData()
const route = useRoute()
</script>

<template lang="pug">
footer
  .noise
  nav
    .flex.flex-col(
      v-for="(page, i) in pages['/']", 
      :key="page?.title",
      )
      a.section(:href="page.path", :class="{ active: route.path.includes(page.path) }") {{ page?.title }}
      .flex.flex-wrap.py-2
        .inline-flex.flex-wrap.items-center(v-for="line in pages[page.path]", :key="line.title")
          a.p-2(:href="line.link", :class="{ active: route.path.includes(line.path) }") {{ line.title }}
          a.p-2.font-normal.text-16px(v-for="child in pages[line.path]" :href="child.path",:class="{ active: route.path.includes(child.path) }") {{ child.title }}

  .flex.items-center.mt-8
    a.m-auto(href="/")
      img.h-8em.my-4(:src="theme.logo") 
      .text-2xl.text-center {{ site.title }}
</template>

<style scoped lang="postcss">
footer {
  @apply relative transition-all min-h-26vh z-1 bg-dark-50 dark-bg-dark-700 flex flex-col pt-16 pb-16 px-4 lg-hidden;
}

nav {
  @apply max-w-55ch mx-auto flex flex-col;
}

.section {
  @apply text-xl mt-8 border-b-1 border-dark-500 px-2 pb-1 mb-2;
}

a {
  @apply transition-all opacity-60 text-dark-900 dark-text-dark-50 hover-(opacity-80 underline);
}

a.active {
  @apply font-bold text-$c-brand dark-text-$c-brand-light border-$c-brand;
}

.noise {
  @apply w-full h-full top-0 left-0 absolute pointer-events-none z-0;
  background: linear-gradient(to bottom, hsla(0, 0%, 0%, 1), transparent),
    url(/img/noise.svg);
  opacity: 0.2;
  filter: contrast(100%) grayscale(100%);
}
</style>
