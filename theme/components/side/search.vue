<script setup>
import { onClickOutside } from "@vueuse/core";
import Fuse from "fuse.js";
import { computed, ref } from "vue";
import { data } from '../../../content/pages.data'
import { cleanLink } from 'vitepress-pages'

const fuse = new Fuse(data, {
  includeScore: true,
  ignoreLocation: true,
  keys: ["frontmatter.title", "frontmatter.description", "frontmatter.city", "frontmatter.place"],
});

const input = ref("");
const candidates = computed(() => fuse.search(input.value));
</script>

<template lang="pug">
.flex.items-center.relative
  .flex.items-center.w-full
    input.w-full.p-2.pl-9.rounded-xl.z-20.bg-light-100.dark-bg-dark-100.shadow(v-model="input")
    button.absolute.left-2.z-400(@mousedown="toggle()" aria-label="Search" v-if="!input" )
      .i-la-search.text-xl
    button.absolute.right-3.z-400(v-else @click="input = ''")
      .i-la-times.text-lg
  .flex.flex-col.max-h-80vh.overflow-y-scroll.shadow-lg.mt-2.rounded-lg.absolute.z-2000.top-10
    a.px-3.py-3.bg-light-400.dark-bg-dark-400.hover-bg-light-100.dark-hover-bg-dark-600.border-1.border-light-100.border-opacity-20(
      :href="cleanLink(candidate.item.url)"
      @click="input = ''"
      v-for="candidate in candidates" :key="candidate"
      :style="{ opacity: 1 - candidate.score / 2 }"
    ) 
      .font-bold {{ candidate.item?.frontmatter?.title }}
      .text-sm.font-normal {{ candidate.item?.frontmatter?.description }} 
      .text-sm.inline-flex(v-if="candidate.item?.frontmatter?.city || candidate.item?.frontmatter?.place")
        .font-bold.whitespace-nowrap {{ candidate.item?.frontmatter?.city }} 
        .ml-2 {{ candidate.item?.frontmatter?.place }}
</template>
