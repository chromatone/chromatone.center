<script setup>
import { computed } from "vue";
import { lchToHsl } from "#/use/colors";

import { useRoute } from 'vitepress'
import { data } from '../../../content/pages.data'
import { cleanLink, usePages } from '../../../theme/pages'


const route = useRoute();

const props = defineProps({
  path: { type: String, default: '' },
  level: { type: Number, default: 0 }
})


const { pages, children } = usePages({ path: props.path }, data)
</script>

<template lang='pug'>
transition(name="fade")
  .flex.flex-col(
    v-show="children && children.length > 0"
    )

    .level(
      v-for="(dot, d) in children" 
      :key="dot.url"
      :aria-current="route.path.includes(cleanLink(dot.url)) ? 'page' : false"
      :style="{ borderColor: lchToHsl(d, children.length) }"
      )
      a(
        :href="cleanLink(dot.url)" 
        :id="dot?.frontmatter?.title" 

        :style="{ color: level == 0 ? lchToHsl(d, children.length) : 'currentColor' }") 
        .flex-auto(:class="{ 'text-lg font-bold': level == 0 }") {{ dot?.frontmatter?.title }}
        .flex-1.min-w-10
        .px-1.flex.items-center(v-if="pages?.[cleanLink(dot.url)]") {{ pages?.[cleanLink(dot.url)]?.length }}

      .flex.flex-col(v-show="route.path.includes(cleanLink(dot.url))")
        SideBarLevel(:path="dot.url" :level="level + 1")
</template>

<style lang="postcss" scoped>
.level {
  @apply my-1 ml-1 cursor-pointer rounded-sm flex flex-col border-l-2 transition-all duration-200 ease-in-out hover-border-l-4 items-stretch bg-light-100/60 backdrop-blur-lx dark-bg-dark-100/60;
}

a {
  @apply font-normal
}

.level a {
  @apply py-2 flex px-2 no-underline block flex w-full text-0.9em;
}

[aria-current="page"] {
  @apply border-l-6 font-bold bg-light-100/70 dark-bg-dark-100/70 hover-border-l-6 backdrop-blur;
}

[aria-current="page"]>a {
  @apply font-bold py-4;
}
</style>