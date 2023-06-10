<script setup>
import { computed } from "vue";
import { lchToHsl } from "#/use/colors";

import { useData, useRoute } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, usePages } from 'vitepress-pages'


const props = defineProps({
  path: { type: String, default: '' },
  level: { type: Number, default: 0 }
})

const route = useRoute();

const { pages, children } = usePages({ path: props.path }, data)
</script>

<template lang='pug'>
transition(name="fade")
  .flex.flex-col(
    v-show="children && children.length > 0"
    :style="{gap: level==0 ? '1em': '0'}"
    )
    transition-group(name="fade")
      .level(
        v-for="(dot, d) in children" 
        :key="dot.url"
        :aria-current="route.path.includes(cleanLink(dot.url)) ? 'page' : false"
        :style="{ borderColor: lchToHsl(d, children.length) }"
        )
        a(
          :href="dot.url" 
          :id="dot?.frontmatter?.title" 

          :style="{ color: level==0 ? lchToHsl(d, children.length)  : ''}") 
          .flex-auto(:class="{'text-xl font-bold': level==0}") {{ dot?.frontmatter?.title }}
          .flex-1
          .p-0(v-if="pages?.[cleanLink(dot.url)]") {{ pages?.[cleanLink(dot.url)]?.length }}

        .flex.flex-col(v-show="route.path.includes(cleanLink(dot.url)) && pages[cleanLink(dot.url)] && pages[cleanLink(dot.url)].length > 0")
          SideBarLevel(:path="dot.url" :level="level+1")
</template>

<style lang="postcss" scoped>
.level {
  @apply my-1 ml-1 cursor-pointer flex flex-col border-l-2 transition-all duration-200 ease-in-out hover-border-l-4 items-stretch;
}

a {
  @apply font-normal
}

.level a {
  @apply py-2 flex px-2 no-underline block flex w-full text-0.85em;
}

[aria-current="page"] {
  @apply border-l-6 font-bold bg-light-100/50 dark-bg-dark-100/50 hover-border-l-6;
}

[aria-current="page"]>a {
  @apply font-bold py-4;
}
</style>