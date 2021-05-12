<template lang="pug">
footer
  nav
    .flex.items-center.flex-col(
      v-for="(page,i) in sortList($site.customData.pages?.main)", 
      :key="page.title",
      v-motion,
      :initial="{ opacity: 0, y: 40 }",
      :enter="{ opacity: 0, y: 0, scale: 1 }",
      :visible="{ opacity: 1, y: 0, scale: 1 }",
      :delay="i * 80",)
      a.section(:href="page.link", :class="{ active: route.path.includes(page.link) }") {{ page.title }}
      .flex.flex-wrap.justify-center
        a.px-2.py-1.font-normal(v-for="line in sortList($site.customData?.pages?.[page.data?.list])", :key="line.title", :href="line.link", :class="{ active: route.path.includes(line.link) }") {{ line.title }}

  .flex.items-center.mt-8
    a.m-auto(href="/")
      img.h-8em.my-4(:src="$themeConfig.logo") 
      .text-2xl.text-center {{ $site.title }}
</template>

<script setup lang="ts">
import { sortList } from '@composables/list.js'
import { useBrowserLocation } from '@vueuse/core'
import { useRoute, useSiteData, inBrowser } from 'vitepress'

const route = useRoute()

</script>

<style scoped lang="postcss">
footer {
  @apply transition-all min-h-26vh z-1 bg-gray-300 dark:bg-dark-700 flex flex-col pt-16 pb-16 px-4;
}

nav {
  @apply max-w-55ch mx-auto flex flex-col;
}

.section {
  @apply text-xl px-2 mt-8 border-b-1 border-gray-500 px-4 pb-1 mb-2;
}

a {
  @apply transition-all opacity-60 text-gray-900 dark:text-gray-50 hover:(opacity-80 no-underline);
}

.active {
  @apply text-$c-brand dark:text-$c-brand-light border-$c-brand;
}
</style>
