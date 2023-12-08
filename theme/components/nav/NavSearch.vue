<script setup>
import { onClickOutside, onKeyStroke, useFocus } from "@vueuse/core";
import Fuse from "fuse.js";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { data } from '../../../content/pages.data'
import { cleanLink } from '../../../pages/index'
import { useRouter } from "vitepress";


const router = useRouter()
const fuse = new Fuse(data, {
  includeScore: true,
  ignoreLocation: true,
  keys: ["frontmatter.title", "frontmatter.description", "frontmatter.city", "frontmatter.place"],
});

const props = defineProps({
  focus: { type: Boolean }
})

const emit = defineEmits(['close'])

const input = ref('');
const candidates = computed(() => fuse.search(input.value));

const inputEl = ref()

const { focused } = useFocus(inputEl)

watch(() => props.focus, (f) => {
  if (!f) return
  setTimeout(() => {
    focused.value = true
  }, 200)
}, { immediate: true })

onClickOutside(inputEl, () => input.value = '')
onKeyStroke('Escape', () => { input.value = '', focused.value = false })
</script>

<template lang="pug">
.flex.flex-col.w-full.gap-2
  .flex.items-center.gap-2.relative
    .i-la-search.text-xl.absolute.z-400.left-2
    input.w-full.p-2.rounded-lg.z-20.bg-light-100.dark-bg-dark-100.shadow.pl-10(
      ref="inputEl"
      id="search"
      v-model="input" 
      placeholder="Search"
      )
    button.z-400.absolute.right-2(v-if="input" @click="input ='';$emit('close')")
      .i-la-times.text-lg
  .flex.flex-col.w-full.gap-2.max-h-80dvh.overflow-y-scroll
    a.px-3.py-3.bg-light-600.rounded.shadow.dark-bg-dark-300.hover-bg-light-100.dark-hover-bg-dark-600.border-1.dark-border-dark-50.border-opacity-20.no-underline(
      tabindex="0"
      @keyup.enter="router.go(cleanLink(candidate.item.url))"
      :href="cleanLink(candidate.item.url)"
      @click="input = ''; $emit('close')"
      v-for="candidate in candidates.filter(c=>c.score<.3)" :key="candidate"
      :style="{ opacity: 1 - candidate.score / 2 }"
      ) 
      .font-bold {{ candidate.item?.frontmatter?.title }}
      .text-sm.font-normal {{ candidate.item?.frontmatter?.description }} 
      .text-sm.inline-flex(v-if="candidate.item?.frontmatter?.city || candidate.item?.frontmatter?.place")
        .font-bold.whitespace-nowrap {{ candidate.item?.frontmatter?.city }} 
        .ml-2 {{ candidate.item?.frontmatter?.place }}
</template>
