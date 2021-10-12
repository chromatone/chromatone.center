<template lang="pug">
.sidebar(:class="{ open }")
  .flex.flex-col
    .group(
      v-for="(main,m) in theme.pages.main" :key="main.title"
        :class="{ active: route.path.includes(main.link) }"
        :style="{ borderColor: lchToHsl(m, theme.pages.main.length) }"
      )
      a.first(
        :href="main.link"
        :style="{ color: lchToHsl(m, theme.pages.main.length) }"
        ) {{ main.title }}
      a.second(
        :class="{ active: route.path.includes(page.link) }"
        :style="{ borderColor: lchToHsl(p, theme.pages?.[main.data?.list].length) }"
        v-for="(page,p) in theme.pages?.[main.data?.list]" :key="page"
        :href="page.link"
      ) 
        .flex.px-2
          span {{ page.title }}
          .flex-1
          span(
            v-if="theme.pages?.[page?.data?.list]"
            :style="{ color: lchToHsl(p, theme.pages?.[main.data?.list].length) }"
            ) {{ theme.pages?.[page?.data?.list].length }}
        .flex.flex-col.my-2(v-if="route.path.includes(page.link) && theme.pages?.[page.data?.list] && theme.pages?.[page.data?.list].length > 0")
          a.third(
            :class="{ active: route.path.includes(line.link) }"
            :style="{ borderColor: lchToHsl(l, theme.pages?.[page.data?.list].length) }"
            v-for="(line,l) in theme.pages?.[page.data?.list]" :key="line"
            :href="line.link"
          ) {{ line.title }}
</template>

<script setup>
import { lchToHsl } from '@use/colors'
defineProps({
  open: { type: Boolean, required: true },
});

import { useData, useRoute } from 'vitepress'
const { site, theme } = useData()
const route = useRoute();


</script>

<style scoped>
.sidebar {
  width: 16.4rem;
  overflow-y: auto;
  transition: all 0.15s ease-out;
  @apply z-20 fixed top-$header-height bottom-0 left-0 transform -translate-x-full lg:(static translate-x-0) shadow-xl bg-light-600 dark:bg-dark-700;
  & a {
    @apply no-underline;
  }
}

.sidebar.open {
  @apply translate-x-0;
}

.group {
  @apply flex flex-col transition-all duration-300 ease-out border-0 my-2 p-1;
}

.first {
  @apply p-2 transition-all duration-300 ease-out text-xl border-l-2;
}

.second {
  @apply flex flex-col my-1 p-1 font-normal transition-all duration-300 ease-out border-l-2 text-1rem;
}

.third {
  @apply my-1 font-normal p-1 border-l-2 text-0.9rem leading-4;
}

.active {
  @apply border-l-4 font-bold;
}
</style>
