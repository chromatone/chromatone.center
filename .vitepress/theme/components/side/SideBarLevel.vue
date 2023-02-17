<script setup>
import { computed } from "vue";
import { useData, useRoute } from "vitepress";
import { pages } from "#/theme/composables/pages";
import { lchToHsl } from "#/use/colors";


const props = defineProps({
  path: { type: String, default: '' },
  level: { type: Number, default: 0 }
})

const list = computed(() => pages[props.path])

const route = useRoute();
</script>

<template lang='pug'>
transition(name="fade")
  .flex.flex-col(
    v-show="route.path.includes(path) && pages[path] && pages[path].length > 0"
    :style="{gap: level==0 ? '1em': '0'}"
    )
    transition-group(name="fade")
      .level(
        v-for="(dot, d) in pages[path]" 
        :key="dot.path"
        :aria-current="route.path.includes(dot.path) ? 'page' : false"
        :style="{ borderColor: lchToHsl(d, pages[path].length) }"
        )
        a(
          :href="dot.path" 
          :id="dot.title" 

          :style="{ color: level==0 ? lchToHsl(d, pages[path].length)  : ''}") 
          .flex-auto(          :class="{'text-xl font-bold': level==0}") {{ dot.title }}
          .flex-1
          .p-0(v-if="pages?.[dot.path]") {{ pages?.[dot.path]?.length }}

        .flex.flex-col(v-show="route.path.includes(dot.path) && pages[dot.path] && pages[dot.path].length > 0")
          SideBarLevel(:path="dot.path" :level="level+1")
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