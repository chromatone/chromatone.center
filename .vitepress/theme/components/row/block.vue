<template lang="pug">
.row
  a.header(:href="item.link")
    .cover(v-if="item.data?.cover", v-motion-fade)
    .info 
      .flex.items-center.w-full(
        :style="{ color: color }"
      )
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        h3
          span.text-3xl {{ item.title }} 
          span.px-2.mt-2(v-if="item.more") 
            radix-icons-text-align-left
        .flex-1
        shop-price(
          :product="item.data?.product" 
          :color="color"
          )

        card-date(v-if="!item.data?.product",:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal.w-full(v-if="item.subtitle") {{ item.subtitle }}
      page-buttons(:buttons="item.data?.buttons" :color="color")

  card-list(v-if="theme.pages?.[item.data?.list]",:rows="theme.pages?.[item.data?.list]" )
</template>

<script setup>
import { useData } from 'vitepress'
const { site, title, theme } = useData()
import { lchToHsl } from '@use/colors.js'
const props = defineProps({
  item: Object,
  color: {
    type: String,
    default: 'currentColor'
  }
});

const bg = "url(/media/" + props.item.data?.cover + ")";
</script>

<style scoped>
.row {
  @apply bg-light-200 dark:bg-dark-300 flex flex-col transition no-underline p-2;
  flex: 1 1 200px;
}

.header {
  @apply flex flex-col flex-1;
}

.info {
  @apply my-4 relative min-w-320px flex self-stretch flex-wrap items-center p-4 md:(px-8 py-4);
  flex: 1 1 45%;
}

.cover {
  @apply w-full min-h-20em bg-cover bg-center rounded;
  filter: saturate(50%) opacity(50%);
  transition: all 300ms ease-in-out;
  flex: 1 1 30%;
  background-image: v-bind(bg);
}

.row:hover .cover {
  filter: saturate(100%) opacity(90%);
}

a:hover {
  text-decoration: none;
}
</style>