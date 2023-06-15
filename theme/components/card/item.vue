<script setup>
import { useData, useRoute } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, useChildren, usePage } from 'vitepress-pages'

const props = defineProps({
  item: Object,
  color: String
});

const children = useChildren({ path: props.item?.url }, data)
</script>

<template lang="pug">
.crd.border-l-6.overflow-hidden(
  :title="item.lastModified",
  :style="{borderColor: color}"
  )
  a.container.no-underline(:href="item.url" :class="{ 'pt-32': item?.frontmatter?.cover }" )
    .cover(v-if="item?.frontmatter?.cover", :style="{ backgroundImage: item?.frontmatter?.cover.split(';')[0] ? `url(${item?.frontmatter?.cover})` : '' }") 
    .info
      .title
        .mr-2.text-2xl(v-if="item?.frontmatter?.emoji") {{ item?.frontmatter?.emoji }}
        .text-2xl.p-2 {{ item?.frontmatter?.title }}
          .absolute.top-10px.text-sm.font-normal.opacity-50
            slot
        .flex-1
        card-date.mr-2(v-if="!item?.frontmatter?.product",:date="item.lastModified")
      .description(
        v-if="item?.frontmatter?.description" 

        ) {{ item?.frontmatter?.description }}
      shop-price(
        v-if="item?.frontmatter?.product"
        :title="item?.frontmatter?.title"
        :product="item?.frontmatter?.product"
        :color="color"
        )

  page-buttons.m-2(:buttons="item?.frontmatter?.buttons")
  line-list(:list="children")
</template>

<style lang="postcss" scoped>
.crd {
  @apply relative bg-light-500 dark-bg-dark-400 flex flex-wrap items-stretch transition-all duration-200 static hover-text-current;
}

.info {
  @apply px-2 pt-4 pb-2 ml-2 m-2 z-4 bg-light-100 bg-opacity-80 dark-(bg-dark-600 bg-opacity-80) rounded-lg relative shadow-md;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  flex: 1 1 100%;
}

.title {
  @apply flex items-center flex-wrap mt-2 !no-underline;
}

.description {
  @apply mt-0 mb-2 px-2 font-normal w-full no-underline;
}

.cover {
  @apply absolute top-0 w-full h-full bg-cover bg-center z-1;

  filter: saturate(50%) brightness(120%) opacity(40%);
  transition: all 600ms cubic-bezier(0.6, -0.1, 0, 1.1);
  flex: 1 0 100%;
  background: cover;
}

.crd:hover .cover {
  filter: saturate(100%) brightness(100%) opacity(90%);
}

.container {
  @apply flex flex-wrap min-w-full items-stretch w-full relative;
  flex: 1 1 100%;
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