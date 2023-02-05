<script setup>
import { lchToHsl } from "#/use/colors";
import { pages } from "#/theme/composables/pages";
import { useData, useRoute } from "vitepress";
import { onMounted, watch } from "vue";
const { site } = useData();

defineProps({
  open: { type: Boolean, required: true },
});

defineEmits(['close'])


const route = useRoute();

onMounted(() => {
  watch(() => route.data, d => {
    const link = document.getElementById(d?.title)
    if (!link) return
    setTimeout(() => {
      link.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start"
      })
    }, 150)

  }, { immediate: true })
})

</script>

<template lang="pug">
transition(name="fade")
  .sidebar-mask.z-50.overscroll-contain(v-show="open", @click="$emit('close')")
.panel(:class="{ open }")
  //- a.title(href="/", :aria-label="`${site.title}, назад в начало`") {{ site.title }}
  side-search.m-3
  .flex.flex-col.gap-8
    .first(v-for="(main, m) in pages['/']" :key="main.title")
      .level(
        :aria-current="route.path.includes(main.path) ? 'page' : false"
        :style="{ borderColor: lchToHsl(m, pages['/'].length) }"
        ) 
        a.mb-2.ml-1(
          style="font-weight:bold"
          :href="main.path"
          :id="main.title"
          :style="{ color: lchToHsl(m, pages['/'].length) }"
          ) {{ main.title }} 
        .flex.flex-col
          .level.second(
            :aria-current="route.path.includes(page.path) ? 'page' : false"
            :style="{ borderColor: lchToHsl(p, pages[main.path].length) }"
            v-for="(page, p) in pages[main.path]" :key="page"
          ) 
            a(:href="page.path" :id="page?.title")
              .text {{ page?.title }}
              .flex-1
              .text(
                v-if="pages[page.path]"
                :style="{ color: lchToHsl(p, pages[page.path].length) }"
                ) {{ pages[page.path].length }}

            transition(name="fade")
              .flex.flex-col.my-2(v-show="route.path.includes(page.path) && pages[page.path] && pages[page.path].length > 0")

                transition-group(name="fade")
                  .level.third.transition-all.duration-200.ease-in(
                    :aria-current="route.path.includes(line.path) ? 'page' : false"
                    v-for="(line, l) in pages[page.path]" :key="line"
                    :style="{ borderColor: lchToHsl(l, pages[page.path].length) }"
                    )
                    a.flex.font-normal(:href="line.path" :id="line?.title") 
                      .text {{ line.title }}
                      .flex-1(v-if="pages[line.path]")
                      .text(
                      v-if="pages[line.path]"
                      :style="{ color: lchToHsl(p, pages[line.path].length) }"
                      ) {{ pages[line.path].length }}
                    transition(name="fade")
                      .flex.flex-col(v-show="route.path.includes(line.path) && pages[line.path] && pages[line.path].length > 0")
                        transition-group(name="fade")
                          .level.fourth(
                            :aria-current="route.path.includes(dot.path) ? 'page' : false"
                            :style="{ borderColor: lchToHsl(d, pages[line.path].length) }"
                            v-for="(dot, d) in pages[line.path]" :key="dot"
                          )
                            a(:href="dot.path" :id="dot?.title") {{ dot.title }}
</template>

<style lang="postcss" scoped>
a {
  @apply no-underline flex items-center px-2;
}

.panel {
  width: 16.4rem;
  flex: 1 0 16.4rem;
  overflow-y: auto;
  transition: all 300ms ease-out;
  @apply max-h-100vh pr-2 pl-1 fixed top-0 bottom-0 left-0 transform -translate-x-full lg-(sticky translate-x-0) shadow-xl bg-light-600 dark-bg-dark-700 overscroll-contain z-51 scroll-ma-xl;
}

.panel a {
  @apply no-underline block flex;
}

.panel.open {
  @apply translate-x-0;
}

.level {
  @apply my-1 ml-1 cursor-pointer flex flex-col border-l-2 transition-all duration-200 ease-in-out hover-border-l-4;


}

.level>a {
  @apply py-2 flex px-2 font-normal;
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
  @apply border-l-6 font-bold bg-light-100/50 dark-bg-dark-100/50 hover-border-l-6;
}

[aria-current="page"]>a {
  @apply font-bold py-4;
}

.title {
  @apply ml-4 mt-4 text-xl inline-flex items-center whitespace-nowrap hover-no-underline;
}
</style>
