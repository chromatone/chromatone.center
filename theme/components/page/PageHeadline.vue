<script setup>
import { computed } from 'vue';

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
  .cover(v-if="page?.cover",:style="{ backgroundImage: `url(${page?.cover})`, backgroundColor: pageColor }")
  img.icon(v-if="page?.icon",:src="page?.icon")
  slot
  .meta(:style="{ borderColor: pageColor }")
    .text-2xl.md-text-3xl.font-bold.flex.flex-wrap.items-center(v-if="page?.title" :key="page.url") 
      .mr-0 {{ page?.title }} 
      .flex-1
      .mx-2.my-0.text-6xl(v-if="page?.emoji") {{ page?.emoji }}
    .mt-0.mb-0(v-if="page?.description") {{ page?.description }}
    page-buttons(:buttons="buttons")

</template>

<style lang="postcss" scoped>
.header {
  @apply p-2 pt-40 relative flex flex-col gap-1 min-h-38svh justify-end overflow-hidden transition-all duration-400 ease-in;
}

.cover {
  @apply overflow-hidden transition-all ease-in-out duration-500 bg-cover bg-center bg-gray-100 dark-(bg-gray-700) absolute top-0 h-full left-0 right-0;
  filter: saturate(20%) sepia(5%) opacity(10%) blur(0px);
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