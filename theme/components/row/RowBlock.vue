<script setup>
import { computed } from 'vue';

import { useRoute, useData } from 'vitepress'
import { data } from '../../../content/pages.data'
import { cleanLink, useChildren } from '../../../theme/pages'

const props = defineProps({
  item: Object,
  color: {
    type: String,
    default: 'currentColor'
  }
});

const children = useChildren({ path: props.item?.url }, data)

const bg = computed(() => `url(${props.item?.frontmatter?.cover})`);

function go(url) {

  const popupWindow = window.open(url, '_blank', 'toolbar=no,location=no,menubar=no,status=no,scrollbars=no,width=800,height=800');
  if (popupWindow) {
    popupWindow.focus();
  } else {
    console.warn('Popup window was blocked. Please enable popups in your browser settings.');
  }
}
</script>

<template lang="pug">
a.header.no-underline.row(
  :style="{ borderColor: color }"
  :href="cleanLink(item.url)"
  :class="{ 'pt-30': item?.frontmatter?.cover }"
  )
  .cover.bg-center(:style="{ backgroundImage: bg }")
  .info.flex-1
    .flex.items-center.w-full
      .mt-0.flex.items-center.w-full
        span.text-xl.font-bold {{ item?.frontmatter?.title }}
        .flex-1
        span(v-if="children") {{ children.length }}
        button.op-30.hover-op-90.transition.i-la-external-link-square-alt(
          v-if="item.frontmatter?.layout == 'app'"
          @click.stop.prevent="go(item.url + '?pure=true')")
      .flex-1
      card-date(v-if="!item?.frontmatter?.product",:date="item.lastModified")
    .text-md.mt-4.mb-2.font-normal.w-full.flex-1(v-if="item?.frontmatter?.description") {{ item?.frontmatter?.description }}
    page-buttons(:buttons="item?.frontmatter?.buttons" :color="color")
</template>

<style lang="postcss" scoped>
.row {
  @apply bg-light-500 w-full dark-bg-dark-500 flex flex transition-all duration-300 ease no-underline rounded-xl overflow-hidden shadow-lg border-0;
  flex: 1 1 80px;
}

.row:hover {
  @apply bg-light-200 dark-bg-dark-400 shadow-xl;
}

.header {
  @apply relative flex flex-col flex-1 w-full;
}

.info {
  @apply m-2 rounded-xl relative flex self-stretch flex-col items-center p-4 bg-light-100 bg-opacity-70 dark-(bg-dark-100 bg-opacity-70) text-dark-100 dark-text-light-100 shadow-md;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.cover {
  @apply absolute w-full top-0 h-full transition scale-105;
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
