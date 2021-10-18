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
      .flex.flex-col
        .second(
          :class="{ active: route.path.includes(page.link) }"
          :style="{ borderColor: lchToHsl(p, theme.pages?.[main.data?.list].length) }"
          v-for="(page,p) in theme.pages?.[main.data?.list]" :key="page"
        ) 

          a.flex.px-2.font-normal.py-1(
            :href="page.link"
          )
            span {{ page.title }}
            .flex-1
            span(
              v-if="theme.pages?.[page?.data?.list]"
              :style="{ color: lchToHsl(p, theme.pages?.[main.data?.list].length) }"
              ) {{ theme.pages?.[page?.data?.list].length }}

          transition(name="fade")
            .flex.flex-col.my-2(v-show="route.path.includes(page.link) && theme.pages?.[page.data?.list] && theme.pages?.[page.data?.list].length > 0")

              transition-group(name="fade")
                .third.transition-all.duration-200.ease-in(
                  :class="{ active: route.path.includes(line.link) }"
                  v-for="(line,l) in theme.pages?.[page.data?.list]" :key="line"
                  :style="{ borderColor: lchToHsl(l, theme.pages?.[page.data?.list].length) }"
                  )
                  a.flex.font-normal(
                    :href="line.link"
                  ) 
                    span {{ line.title }}
                    .flex-1(v-if="theme.pages?.[line?.data?.list]")
                    span(
                    v-if="theme.pages?.[line?.data?.list]"
                    :style="{ color: lchToHsl(p, theme.pages?.[line.data?.list].length) }"
                    ) {{ theme.pages?.[line?.data?.list].length }}
                  transition(name="fade")
                    .flex.flex-col.py-2(v-show="route.path.includes(line.link) && theme.pages?.[line.data?.list] && theme.pages?.[line.data?.list].length > 0")
                      transition-group(name="fade")
                        a.text-1em.p-2.my-1.font-normal.transition-all.duration-200.ease-in.border-l-2(
                          :href="dot.link"
                          :class="{ active: route.path.includes(dot.link) }"
                          :style="{ borderColor: lchToHsl(d, theme.pages?.[line.data?.list].length) }"
                          v-for="(dot,d) in theme.pages?.[line?.data?.list]" :key="dot"
                          ) {{ dot.title }}
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
  flex: 1 0 16.4rem;
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
  @apply flex flex-col transition-all duration-300 ease-out border-l-2 my-2 pl-2;
}

.first {
  @apply py-2 transition-all duration-300 ease-out text-xl;
}

.second {
  @apply flex flex-col my-1 py-1 font-normal transition-all duration-300 ease-out border-l-2 text-1.1rem;
}

.third {
  @apply flex flex-col my-1 mx-2 py-2 font-normal px-2 border-l-2 text-1rem leading-4;
}

.active {
  @apply border-l-4 font-bold bg-light-100/50 dark:bg-dark-100/50 rounded;
  > a {
    @apply font-bold;
  }
}
</style>
