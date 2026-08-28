<script setup>
import { computed } from 'vue';
import { usePages, usePage, cleanLink } from '../../pages'
import { useRoute, useData } from "vitepress";
import { data } from '../../../content/pages.data'
const route = useRoute();

const { pages, children, siblings, parents } = usePages(route, data)

const props = defineProps({
  pageColor: { type: String },
  lightColor: { type: String },
  cover: { type: String },
  page: { type: Object }
})

const buttons = computed(() => {
  if (props.page?.buttons) return props.page?.buttons
  const btns = []
  if (props.page?.url) {
    btns.push({
      url: props.page.url,
      text: props.page.url,
      type: 'primary'
    })
  }
  if (props.page?.github) {
    btns.push({
      url: props.page.github,
      text: props.page.github,
      type: 'github'
    })
  }
  return btns
})
</script>

<template lang="pug">
.header(
  v-if="!$frontmatter.misc"
  :class="{ 'has-cover': page?.cover || page?.icon }"
  :style="{ backgroundColor: pageColor }"
  ) 
  .cover(v-if="page?.cover",:style="{ backgroundImage: `url(${cover})`, backgroundColor: pageColor }") 
  .w-full.max-w-60ch.flex.flex-wrap.items-stretch.justify-start.gap-2
    a.text-sm.transition.rounded-lg.no-underline.flex.items-center.px-2.py-1.bg-light-300.dark-bg-dark-100.hover-bg-light-100.hover-dark-bg-dark-100.z-100(
      v-for="page in parents", 
      :key="page.url" 
      :href="cleanLink(page.url)") 
      span.font-bold {{ page?.frontmatter?.title }}
  .flex-1
  img.icon(v-if="page?.icon",:src="page?.icon")

  .meta(:style="{ borderColor: pageColor }")
    .font-bold.flex.flex-wrap.items-center(v-if="page?.title" :key="page.url") 
      .text-2xl.md-text-3xl.-mt-2 {{ page?.title }} 
      .flex-1
      .mx-2.my-0.text-6xl(v-if="page?.emoji") {{ page?.emoji }}
    .mt-0.mb-0(v-if="page?.description") {{ page?.description }}
    page-buttons(:buttons="buttons")
  slot
</template>

<style lang="postcss" scoped>
.header {
  @apply p-4 h-full relative flex flex-col gap-1 min-h-38svh justify-start overflow-hidden transition-all duration-400 ease-in rounded-1rem;
}

.cover {
  @apply overflow-hidden transition-all ease-in-out duration-500 bg-cover bg-center bg-gray-100 dark-(bg-gray-700) absolute top-0 h-full left-0 right-0;
  filter: saturate(20%) sepia(5%) opacity(50%) blur(0px);
}

@media print {
  .cover {
    @apply h-100px;
  }
}

.header:hover .cover {
  filter: saturate(70%) sepia(0%) opacity(90%) blur(0);
}

.icon {
  @apply m-4 max-h-20em max-w-20em;
}

.meta {
  @apply gap-2 relative p-6 bg-light-100 bg-opacity-80 z-3 max-w-60ch w-full flex flex-col rounded-xl shadow-xl dark-(bg-true-gray-800 bg-opacity-80);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
</style>