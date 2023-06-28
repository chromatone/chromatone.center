<script setup>
import { onClickOutside, useFocus } from "@vueuse/core";
import Fuse from "fuse.js";
import { computed, nextTick, onMounted, ref } from "vue";
import { data } from '../../../content/pages.data.js'

const fuse = new Fuse(data, {
  includeScore: true,
  ignoreLocation: true,
  keys: ["frontmatter.title", "frontmatter.description", "frontmatter.city", "frontmatter.place"],
});

const emit = defineEmits(['close'])

const input = ref('');
const candidates = computed(() => fuse.search(input.value));

const inputEl = ref()

const { focused } = useFocus(inputEl)

onMounted(() => {
  nextTick(focused.value = true)
})
</script>

<template lang="pug">
.flex.items-center.flex-col.w-full
  .flex.items-center
    input.w-full.p-2.rounded-xl.z-20.bg-light-100.dark-bg-dark-100.shadow.top-8(

      ref="inputEl"
      id="search"
      v-model="input" 
      placeholder="Search"
      )
    button.-m-6.z-400(v-if="input" @click="input =''")
      .i-la-times.text-lg
  .absolute.top-16.flex.flex-col.max-h-80vh.overflow-y-scroll.shadow-lg.mt-2.rounded-lg.z-2000.top-10(v-if="input")
    a.px-3.py-3.bg-light-400.dark-bg-dark-400.hover-bg-light-100.dark-hover-bg-dark-600.border-1.border-light-100.border-opacity-20(
      :href="candidate.item.url"
      @click="input = ''; $emit('close')"
      v-for="candidate in candidates" :key="candidate"
      :style="{ opacity: 1 - candidate.score / 2 }"
      ) 
      .font-bold {{ candidate.item?.frontmatter?.title }}
      .text-sm.font-normal {{ candidate.item?.frontmatter?.description }} 
      .text-sm.inline-flex(v-if="candidate.item?.frontmatter?.city || candidate.item?.frontmatter?.place")
        .font-bold.whitespace-nowrap {{ candidate.item?.frontmatter?.city }} 
        .ml-2 {{ candidate.item?.frontmatter?.place }}
</template>
