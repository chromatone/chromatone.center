<template lang="pug">
.panel(:class="{ open }")
  .flex.flex-col
    .my-4.first(
      v-for="(main,m) in theme.pages.main" :key="main.title"
    )
      .level(
        :aria-current="route.path.includes(main.link) ? 'page' : false"
        :style="{ borderColor: lchToHsl(m, theme.pages.main.length) }"
        )
        a.mb-2.ml-1(
          style="font-weight:bold"
          :href="main.link"
          :style="{ color: lchToHsl(m, theme.pages.main.length) }"
          ) {{ main.title }}
        .flex.flex-col
          .level.second(
            :aria-current="route.path.includes(page.link) ? 'page' : false"
            :style="{ borderColor: lchToHsl(p, theme.pages?.[main.data?.list].length) }"
            v-for="(page,p) in theme.pages?.[main.data?.list]" :key="page"
          ) 
            a(
              :href="page.link"
            )
              .text {{ page.title }}
              .flex-1
              .text(
                v-if="theme.pages?.[page?.data?.list]"
                :style="{ color: lchToHsl(p, theme.pages?.[main.data?.list].length) }"
                ) {{ theme.pages?.[page?.data?.list].length }}

            transition(name="fade")
              .flex.flex-col.my-2(v-show="route.path.includes(page.link) && theme.pages?.[page.data?.list] && theme.pages?.[page.data?.list].length > 0")

                transition-group(name="fade")
                  .level.third.transition-all.duration-200.ease-in(
                    :aria-current="route.path.includes(line.link) ? 'page' : false"
                    v-for="(line,l) in theme.pages?.[page.data?.list]" :key="line"
                    :style="{ borderColor: lchToHsl(l, theme.pages?.[page.data?.list].length) }"
                    )
                    a.flex.font-normal(
                      :href="line.link"
                    ) 
                      .text {{ line.title }}
                      .flex-1(v-if="theme.pages?.[line?.data?.list]")
                      .text(
                      v-if="theme.pages?.[line?.data?.list]"
                      :style="{ color: lchToHsl(p, theme.pages?.[line.data?.list].length) }"
                      ) {{ theme.pages?.[line?.data?.list].length }}
                    transition(name="fade")
                      .flex.flex-col(v-show="route.path.includes(line.link) && theme.pages?.[line.data?.list] && theme.pages?.[line.data?.list].length > 0")
                        transition-group(name="fade")
                          .level.fourth(
                            :aria-current="route.path.includes(dot.link) ? 'page' : false"
                            :style="{ borderColor: lchToHsl(d, theme.pages?.[line.data?.list].length) }"
                            v-for="(dot,d) in theme.pages?.[line?.data?.list]" :key="dot"
                          )
                            a(
                              :href="dot.link"

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
.panel {
  width: 16.4rem;
  flex: 1 0 16.4rem;
  overflow-y: auto;
  transition: all 300ms ease-out;
  @apply pr-2 pl-1 z-20 fixed rounded-xl top-$header-height bottom-0 left-0 transform -translate-x-full lg_(static translate-x-0) shadow-xl bg-light-600 dark_bg-dark-700;
  & a {
    @apply no-underline block flex;
  }
}

.panel.open {
  @apply translate-x-0;
}

.level {
  @apply my-1 ml-1 cursor-pointer flex flex-col border-l-2 transition-all duration-200 ease-in-out hover_border-l-4;
  > a {
    @apply py-2 flex px-2 font-normal;
  }
}

.first {
  @apply text-xl;
}

.second {
  @apply font-normal text-1rem;
}

.third {
  @apply font-normal text-1rem leading-6;
}

.fourth {
  @apply font-normal;
}

[aria-current="page"] {
  @apply border-l-6 font-bold bg-light-100/50 dark_bg-dark-100/50 hover_border-l-6;
  > a {
    @apply font-bold py-4;
  }
}
</style>
