<script setup>
import { computed } from 'vue';

import { useRoute, useData } from 'vitepress'
import { data } from '../../../content/pages.data'
import { cleanLink, useChildren } from '../../../pages/index'

const props = defineProps({
  item: Object,
  color: {
    type: String,
    default: 'currentColor'
  }
});

const route = useRoute();
const children = useChildren({ path: props.item?.url }, data)

const bg = computed(() => `url(${props.item?.frontmatter?.cover})`);
</script>

<template lang="pug">
.row(
  :style="{ borderColor: color }"
  )
  a.header.no-underline(
    :href="cleanLink(item.url)"
    :class="{ 'pt-70': item?.frontmatter?.cover }"
  )
    .cover(
      :style="{ backgroundImage: bg }"
      )
    .info 
      .flex.items-center.w-full
        .mr-2.text-2xl(v-if="item?.frontmatter?.emoji") {{ item?.frontmatter?.emoji }}
        .mt-1
          span.text-2xl {{ item?.frontmatter?.title }} 
          span.text-xl.px-2.mt-2(v-if="item?.frontmatter?.more") 
            .i-radix-icons-text-align-left
        .flex-1
        card-date(v-if="!item?.frontmatter?.product",:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal.w-full(v-if="item?.frontmatter?.description") {{ item?.frontmatter?.description }}
      page-buttons(:buttons="item?.frontmatter?.buttons" :color="color")
</template>

<style lang="postcss" scoped>
.row {
  @apply bg-light-500 w-full dark-bg-dark-500 flex flex-col transition-all duration-300 ease no-underline rounded overflow-hidden shadow-lg max-w-60ch border-l-6 mx-auto;
  flex: 1 1 200px;
}

.row:hover {
  @apply bg-light-200 dark-bg-dark-400 shadow-xl;
}

.header {
  @apply relative flex flex-col flex-1 w-full;
}

.info {
  @apply relative flex self-stretch flex-wrap items-center p-4 md-(px-5 py-4) bg-light-100 bg-opacity-70 dark-(bg-dark-100 bg-opacity-70) text-dark-100 dark-text-light-100 shadow-md;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.cover {
  @apply absolute w-full top-0 h-full;
  filter: saturate(50%) opacity(50%) brightness(50%);
  transition: all 250ms ease-in-out;
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
