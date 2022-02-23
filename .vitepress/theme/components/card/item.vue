<script setup>
import { useData } from 'vitepress'

const { theme } = useData()

const props = defineProps({
  item: Object,
  color: String
});
const theColor = computed(() => props.color);
</script>

<template lang="pug">
.crd(
  :title="item.lastModified",
  )
  a.container(:href="item.link" :class="{ 'pt-32': item.data?.cover }")
    .cover(v-if="item.data.cover", :style="{ backgroundImage: 'url(/media/' + item.data.cover + ')' }") 
    .info
      .title
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        .text-2xl.p-2 {{ item.title }}
          .absolute.top-10px.text-sm.font-normal.opacity-50
            slot
        .flex-1
        card-date.mr-2(v-if="!item.data.product",:date="item.lastModified")
      .subtitle(
        v-if="item.subtitle" 

        ) {{ item.subtitle }}
      shop-price.float-left(:product="item.data?.product" :color="color")

  page-buttons.m-2(:buttons="item.data?.buttons")
  line-list(:list="theme?.pages?.[item.data.list]")
</template>

<style  scoped>
.crd {
  @apply relative  bg-light-500 dark_bg-dark-800
  flex flex-wrap items-stretch justify-stretch
  transition-all  duration-200
  static;
  & .container {
    @apply flex flex-wrap min-w-full items-stretch w-full relative;
    flex: 1 1 100%;
    background-color: v-bind(theColor);
  }
  & .info {
    @apply px-2 py-4 ml-2 m-2 z-4 max-w-24em bg-light-100 bg-opacity-80 dark_(bg-dark-600 bg-opacity-80) rounded-xl relative;
    -webkit-backdrop-filter: blur(12px);
    backdrop-filter: blur(12px);
    flex: 1 1 100%;
  }
  & .title {
    @apply flex items-center flex-wrap mt-2;
  }
  & .subtitle {
    @apply mt-0 mb-2 p-2 font-normal w-full;
  }
  & .cover {
    @apply absolute top-0 w-full h-full bg-cover bg-center z-1;

    filter: saturate(50%) brightness(160%) opacity(30%);
    transition: all 900ms cubic-bezier(0.6, -0.1, 0, 1.1);
    flex: 1 0 100%;
    background: cover;
  }
  &:hover .cover {
    filter: saturate(100%) brightness(100%) opacity(90%);
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