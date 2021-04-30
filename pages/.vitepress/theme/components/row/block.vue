<template lang="pug">
.block(
  :id="item.title"
  v-motion,
  :initial="{ opacity: 0, y: 40 }",
  :enter="{ opacity: 0, y: 0, scale: 1 }",
  :visible="{ opacity: 1, y: 0, scale: 1 }",
  :delay="i * 80",
  :style="{ zIndex: i + 10, borderColor: lchToHsl(i, total) }"
  )
  a.header(:href="item.link")
    .media.w-full.h-12em.bg-cover.bg-center.mb-8.rounded(v-if="item.data.media", :style="{ backgroundImage: 'url(/media/' + item.data.media + ')' }", v-motion-fade)
    .info
      .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
      h3.text-3xl.flex.items-center {{ item.title }} 
      .px-2.mt-2(v-if="item.more") 
        radix-icons-text-align-left
      .flex-auto
      card-date(:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal.w-full(v-if="item.subtitle") {{ item.subtitle }}
      .text-xl.font-bold.rounded-xl.text-orange-800.p-2.mt-4(class="dark:text-orange-300",v-if="item.data.price") {{ item.data.price }}
  card-list(v-if="$site.customData.pages?.[item.data.list]",:rows="$site.customData.pages?.[item.data.list]")

</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

import { lchToHsl } from '@composables/colors.js'

</script>

<style lang="postcss" scoped>
.block {
  @apply my-8 shadow-lg rounded-md
  flex flex-col items-stretch 
  border-l border-l-w-4 transition-all
  static;
}

.header {
  @apply flex flex-col min-content flex-1;
}

.info {
  @apply flex flex-1 self-stretch flex-wrap items-center p-4 md:(px-8 py-4);
}

.media {
  filter: saturate(10%) opacity(50%);
  transition: all 200ms ease-in-out;
}

.block:hover .media {
  filter: saturate(50%) opacity(70%);
}

a:hover {
  text-decoration: none;
}
</style>