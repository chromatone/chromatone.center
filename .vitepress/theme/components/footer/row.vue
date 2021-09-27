<template lang="pug">
footer.relative
  .noise
  nav
    .flex.flex-col(
      v-for="(page,i) in theme.pages?.main", 
      :key="page.title",
      )
      a.section(:href="page.link", :class="{ active: route.path.includes(page.link) }") {{ page.title }}
      .flex.flex-wrap.py-2
        .inline-flex.flex-wrap.items-center(v-for="line in theme?.pages?.[page.data?.list]", :key="line.title")
          a.p-2(:href="line.link", :class="{ active: route.path.includes(line.link) }") {{ line.title }}
          a.p-2.font-normal.text-16px(v-for="child in theme?.pages?.[line.data?.list]" :href="child.link",:class="{ active: route.path.includes(child.link) }") {{ child.title }}

  .flex.items-center.mt-8(v-motion,
    :initial="{ opacity: 0, y: 40 }",
    :enter="{ opacity: 0, y: 0, scale: 1 }",
    :visible=`{
      opacity: 1, y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
        restDelta: 0.5,
        restSpeed: 10,
      }
    }`,
    :delay="100"

    )
    a.m-auto(href="/")
      img.h-8em.my-4(:src="theme.logo") 
      .text-2xl.text-center {{ site.title }}
</template>

<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
const { site, theme } = useData()
const route = useRoute()
</script>

<style scoped >
footer {
  @apply transition-all min-h-26vh z-1 bg-gray-300 dark:bg-dark-700 flex flex-col pt-16 pb-16 px-4;
}

nav {
  @apply max-w-55ch mx-auto flex flex-col;
}

.section {
  @apply text-xl mt-8 border-b-1 border-gray-500 px-2 pb-1 mb-2;
}

a {
  @apply transition-all opacity-60 text-gray-900 dark:text-gray-50 hover:(opacity-80 underline);
  &.active {
    @apply font-bold text-$c-brand dark:text-$c-brand-light border-$c-brand;
  }
}

.noise {
  @apply w-full h-full top-0 left-0 absolute pointer-events-none z-0;
  background: linear-gradient(to bottom, hsla(0, 0%, 0%, 1), transparent),
    url(/img/noise.svg);
  opacity: 0.2;
  filter: contrast(100%) grayscale(100%);
}
</style>
