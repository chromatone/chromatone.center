<template lang="pug">
.crd(
  :title="item.lastModified",
  )
  a.flex.flex-wrap.items-stretch.w-full(:href="item.link")
    .cover(v-if="item.data.cover", :style="{ backgroundImage: 'url(/media/' + item.data.cover + ')' }", v-motion-fade) 
    .info
      .flex.flex-1.items-center.self-stretch.flex-wrap
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        .text-2xl.flex-auto(:style="{ color: color }") {{ item.title }}
        card-date(v-if="!item.data.product",:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal(v-if="item.subtitle") {{ item.subtitle }}
      shop-price.float-left(:product="item.data?.product")

  page-buttons(:buttons="item.data?.buttons")
  line-list(:list="theme?.pages?.[item.data.list]")
</template>

<script setup>
import { useData } from 'vitepress'

const { theme } = useData()

const props = defineProps({
  item: Object,
  color: String
});
</script>

<style  scoped>
.crd {
  @apply rounded-sm mx-2 md:mx-0 sm:mx-4 bg-light-500 dark:bg-dark-500
  flex flex-wrap items-stretch 
  transition-all px-2  duration-200
  static;
  &:hover {
    @apply bg-light-100 dark:bg-dark-400;
  }
  & .info {
    @apply px-2 py-4 my-auto;
    flex: 1 0 100%;
  }
  & .cover {
    @apply min-h-8em min-w-5em w-full bg-cover bg-center rounded;
    filter: saturate(10%) opacity(70%);
    transition: all 1200ms cubic-bezier(0.6, -0.1, 0, 1.1);
    flex: 1 0 100%;
    backgound: cover;
  }
  &:hover .cover {
    filter: saturate(60%) opacity(80%);
  }
}

.crd.seen {
  @apply opacity-70;
}

a:hover .art {
  filter: saturate(50%);
}

a:hover {
  text-decoration: none;
}
</style>