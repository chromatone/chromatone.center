<script setup>

import { lchToHsl } from '#/use/colors'
import { computed } from 'vue';
import { isDark } from '#/theme/composables/state'
import { colord } from 'colord'

import { useRoute, useData } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, useChildren } from 'vitepress-pages'

const props = defineProps({
  item: Object,
  color: {
    type: String,
    default: 'currentColor'
  }
});

const route = useRoute();
const children = useChildren({ path: props.item?.url }, data)

const bg = computed(() => `url(${props.item?.frontmatter?.cover}`);
</script>

<template lang="pug">
.row(
  :style="{ borderColor: color }"
  )
  a.header.no-underline(
    :href="item.url"
    :class="{ 'pt-48': item?.frontmatter?.cover }"
  )
    .cover(
      :style="{ backgroundImage: bg }"
      )
    .info 
      .flex.items-center.w-full
        .mr-2.text-2xl(v-if="item?.frontmatter?.emoji") {{ item?.frontmatter?.emoji }}
        h3
          span.text-3xl {{ item?.frontmatter?.title }} 
          span.px-2.mt-2(v-if="item?.frontmatter?.more") 
            .i-radix-icons-text-align-left
        .flex-1
        card-date(v-if="!item?.frontmatter?.product",:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal.w-full(v-if="item?.frontmatter?.description") {{ item?.frontmatter?.description }}
      page-buttons(:buttons="item?.frontmatter?.buttons" :color="color")
      shop-price.w-full(
        v-if="item?.frontmatter?.product"
        :title="item?.frontmatter?.title"
        :product="item?.frontmatter?.product" 
        :color="color"
        )
  card-list(
    v-if="children",
    :cards="children"
    ) {{ item?.frontmatter?.title }}
</template>

<style lang="postcss" scoped>
.row {
  @apply bg-light-500 w-full dark-bg-dark-500 flex flex-col transition-all duration-300 ease no-underline rounded-lg overflow-hidden shadow-lg max-w-65ch border-l-8;
  flex: 1 1 200px;
}

.row:hover {
  @apply bg-light-200 dark-bg-dark-400 shadow-xl;
}

.header {
  @apply relative flex flex-col flex-1 w-full;
}

.info {
  @apply m-2 relative max-w-500px flex self-stretch flex-wrap items-center p-4 md-(px-5 py-4) bg-light-100 bg-opacity-70 dark-(bg-dark-100 bg-opacity-70) rounded-xl text-dark-100 dark-text-light-100 shadow-md;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.cover {
  @apply absolute w-full top-0 h-full;
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
