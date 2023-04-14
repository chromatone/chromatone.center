<script setup>
import { useData } from 'vitepress'
import { pages } from '#/theme/composables/pages'

const props = defineProps({
  item: Object,
  color: String
});
</script>

<template lang="pug">
.crd.border-l-4(
  :title="item.lastModified",
  :style="{borderColor: color}"
  )
  a.container.no-underline(:href="item.path" :class="{ 'pt-32': item?.cover }" )
    .cover(v-if="item?.cover", :style="{ backgroundImage: `url(${item.cover})` }") 
    .info
      .title
        .mr-2.text-2xl(v-if="item.emoji") {{ item.emoji }}
        .text-2xl.p-2 {{ item.title }}
          .absolute.top-10px.text-sm.font-normal.opacity-50
            slot
        .flex-1
        card-date.mr-2(v-if="!item?.product",:date="item.lastModified")
      .description(
        v-if="item.description" 

        ) {{ item.description }}
      shop-price.float-left(
        v-if="item?.product"
        :title="item?.title"
        :product="item?.product"
        :color="color"
        )

  page-buttons.m-2(:buttons="item?.buttons")
  line-list(:list="pages[item.path]")
</template>

<style lang="postcss" scoped>
.crd {
  @apply relative bg-light-500 dark-bg-dark-400 flex flex-wrap items-stretch transition-all duration-200 static;
}

.info {
  @apply px-2 pt-4 pb-1 ml-2 m-2 z-4 max-w-24em bg-light-100 bg-opacity-80 dark-(bg-dark-600 bg-opacity-80) rounded-xl relative;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  flex: 1 1 100%;
}

.title {
  @apply flex items-center flex-wrap mt-2 !no-underline;
}

.description {
  @apply mt-0 mb-2 p-2 font-normal w-full no-underline;
}

.cover {
  @apply absolute top-0 w-full h-full bg-cover bg-center z-1;

  filter: saturate(50%) brightness(160%) opacity(30%);
  transition: all 900ms cubic-bezier(0.6, -0.1, 0, 1.1);
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