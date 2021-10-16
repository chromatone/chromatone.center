<template lang="pug">
.row(
  :style="{ backgroundColor: color, borderColor: color }"
  )
  a.header(
    :href="item.link"
    :class="{ 'pt-48': item.data?.cover }"
  )
    .cover(
      :style="{ backgroundImage: bg }"
      )
    .info 
      .flex.items-center.w-full
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

const bg = computed(() => `url(/media/${props.item.data?.cover}`);
</script>

<style scoped>
.row {
  @apply bg-light-500 w-full border-4 dark:bg-dark-500 flex flex-col transition no-underline rounded-xl shadow-lg;
  flex: 1 1 200px;
  &:hover {
    @apply bg-light-200 dark:bg-dark-400 shadow-xl;
  }
}

.header {
  @apply relative flex flex-col flex-1 w-full;
}

.info {
  @apply m-2 relative max-w-500px flex self-stretch flex-wrap items-center p-4 md:(px-8 py-4) bg-light-100 dark:bg-dark-100 rounded-lg;
}

.cover {
  @apply absolute w-full rounded-xl top-0 h-full rounded-xl;
  filter: saturate(50%) opacity(30%);
  transition: all 450ms ease-in-out;
  flex: 1 1 30%;
  background-size: cover;
}

.row:hover .cover {
  filter: saturate(100%) opacity(90%);
}

a:hover {
  text-decoration: none;
}
</style>