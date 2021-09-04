<template lang="pug">
.crd(
  :title="item.lastModified",
  )
  a.flex.flex-col.items-stretch(:href="item.link")
    .cover(v-if="item.data.cover", :style="{ backgroundImage: 'url(/media/' + item.data.cover + ')' }", v-motion-fade) 
    .info
      .flex.flex-1.items-center.self-stretch.flex-wrap
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        .text-2xl.flex-auto(:style="{ color: color }") {{ item.title }}
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
  color: String
});
</script>

<style  scoped>
.crd {
  @apply rounded-sm mx-2 md:mx-0 sm:mx-4 bg-light-200 dark:bg-dark-200
  flex flex-col items-stretch 
  transition-all px-2 py-4 duration-1000
  static;
}

.crd.seen {
  @apply opacity-70;
}

.info {
  @apply pt-8 px-2 my-auto;
  flex: 1 1 80%;
}

.cover {
  @apply min-h-4em bg-cover bg-center rounded;
  filter: saturate(10%) opacity(70%);
  transition: all 1200ms cubic-bezier(0.6, -0.1, 0, 1.1);
  flex: 1 1 20%;
  backgound: cover;
}

.crd:hover .cover {
  filter: saturate(60%) opacity(80%);
  @apply min-h-20em;
}

a:hover .art {
  filter: saturate(50%);
}

a:hover {
  text-decoration: none;
}
</style>