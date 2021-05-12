<template lang="pug">
.block(
  :id="item.title"
  v-motion,
  :initial="{ opacity: 0, y: 40 }",
  :enter="{ opacity: 0, y: 0, scale: 1 }",
  :visible="{ opacity: 1, y: 0, scale: 1 }",
  :style="{ zIndex: i + 10, borderColor: lchToHsl(i, total) }"
  )
  a.header(:href="item.link")
    .cover(v-if="item.data?.cover", :style="{ backgroundImage: 'url(/media/' + item.data?.cover + ')' }", v-motion-fade)
    .info
      .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
      h3.text-3xl.flex.items-center {{ item.title }} 

      .px-2.mt-2(v-if="item.more") 
        radix-icons-text-align-left
      .flex-auto
      card-date(v-if="!item.data?.product",:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal.w-full(v-if="item.subtitle") {{ item.subtitle }}
      shop-price(:product="item.data?.product")
      header-buttons(:buttons="item.data?.buttons")
  card-list(v-if="$site.customData.pages?.[item.data?.list]",:rows="$site.customData.pages?.[item.data?.list]")

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
  @apply my-8 shadow-lg rounded-md mx-2 md:mx-0 sm:mx-4 bg-light-200 dark:bg-dark-200
  flex flex-col items-stretch 
  transition-all
  static;
}

.header {
  @apply flex flex-col min-content flex-1;
}

.info {
  @apply my-4 flex flex-1 self-stretch flex-wrap items-center p-4 md:(px-8 py-4);
}

.cover {
  @apply w-full h-16em bg-cover bg-center mb-2 rounded;
  filter: saturate(10%) opacity(50%);
  transition: all 600ms ease-in-out;
}

.block:hover .cover {
  filter: saturate(100%) opacity(90%);
}

a:hover {
  text-decoration: none;
}
</style>