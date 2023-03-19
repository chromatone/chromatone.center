<script setup>
import { useData, useRoute } from 'vitepress'
import { pages, usePage } from '#/theme/composables/pages'
import { lchToHsl } from '#/use/colors'
import { computed } from 'vue';
import { isDark } from '#/theme/composables/state'

import { colord } from 'colord'

const route = useRoute()

const page = usePage(route.path)

const props = defineProps({
  item: Object,
  color: {
    type: String,
    default: 'currentColor'
  }
});

const bg = computed(() => `url(${props.item?.cover}`);
</script>

<template lang="pug">
.row(
  :style="{ backgroundColor: color }"
  )
  a.header.no-underline(
    :href="item.path"
    :class="{ 'pt-48': item?.cover }"
  )
    .cover(
      :style="{ backgroundImage: bg }"
      )
    .info 
      .flex.items-center.w-full
        .mr-2.text-2xl(v-if="item.emoji") {{ item.emoji }}
        h3
          span.text-3xl {{ item.title }} 
          span.px-2.mt-2(v-if="item.more") 
            .i-radix-icons-text-align-left
        .flex-1
        card-date(v-if="!item?.product",:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal.w-full(v-if="item?.description") {{ item.description }}
      page-buttons(:buttons="item?.buttons" :color="color")
      shop-price.my-2(
        v-if="item?.product"
        :title="item.title"
        :product="item?.product" 
        :color="'color'"
        )
  card-list(
    v-if="pages[item.path]",
    :cards="pages[item.path]"
    ) {{ item.title }}
</template>

<style lang="postcss" scoped>
.row {
  @apply bg-light-500 w-full dark-bg-dark-500 flex flex-col transition-all duration-300 ease no-underline rounded-3xl overflow-hidden shadow-lg max-w-65ch;
  flex: 1 1 200px;
}

.row:hover {
  @apply bg-light-200 dark-bg-dark-400 shadow-xl;
}

.header {
  @apply relative flex flex-col flex-1 w-full;
}

.info {
  @apply m-2 relative max-w-500px flex self-stretch flex-wrap items-center p-4 md-(px-5 py-4) bg-light-100 bg-opacity-70 dark-(bg-dark-100 bg-opacity-70) rounded-3xl;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.cover {
  @apply absolute w-full top-0 h-full rounded-xl;
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
