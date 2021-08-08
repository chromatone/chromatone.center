<template lang="pug">
.crd(
  :style="{ borderColor: rowColor }"
  :title="item.lastModified",
  )
  a.flex(:href="item.link")
    .cover(v-if="item.data.cover", :style="{ backgroundImage: 'url(/media/' + item.data.cover + ')' }", v-motion-fade)
    .info
      .flex.flex-1.items-center.self-stretch.flex-wrap
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        .text-2xl.flex-auto {{ item.title }}
        card-date(v-if="!item.data.product",:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal(v-if="item.subtitle") {{ item.subtitle }}
      shop-price.float-left(:product="item.data?.product", :showButton="false")
  page-buttons(:buttons="item.data?.buttons")
  line-list(:list="site.customData.pages?.[item.data.list]")
</template>

<script setup>
import { useData } from 'vitepress'

const { site } = useData()
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

import { lchToHsl } from '@theme/composables/colors.js'
const rowColor = lchToHsl(props.i, props.total);
</script>

<style  scoped>
.crd {
  @apply my-8 shadow-md rounded-sm mx-2 md:mx-0 sm:mx-4 bg-light-200 dark:bg-dark-200
  flex flex-col items-stretch 
  transition-all
  static;
  border-width: 2px 2px 10px 2px;
}

.crd.seen {
  @apply opacity-70;
}

.info {
  @apply p-4 my-auto;
}

.cover {
  @apply bg-cover bg-center self-stretch h-full min-h-16em sm:min-w-16em min-w-6em rounded-xl;
  flex-basis: 6em;
  filter: saturate(10%) opacity(70%);
  transition: all 200ms ease-in-out;
  flex: 1 1 100px;
}

.crd:hover .cover {
  filter: saturate(60%) opacity(80%);
}

a:hover .art {
  filter: saturate(50%);
}

a:hover {
  text-decoration: none;
}
</style>