<template lang="pug">
.crd(
  :title="item.lastModified",
  )
  a.container(:href="item.link")
    .cover(v-if="item.data.cover", :style="{ backgroundImage: 'url(/media/' + item.data.cover + ')' }") 
    .info
      .title
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        .text-2xl.p-2 {{ item.title }}
        .flex-1
        card-date.mr-2(v-if="!item.data.product",:date="item.lastModified")
      .subtitle(
        v-if="item.subtitle" 

        ) {{ item.subtitle }}
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
const theColor = computed(() => props.color);
</script>

<style  scoped>
.crd {
  @apply relative rounded-xl bg-light-500 dark:bg-dark-500
  flex flex-wrap items-stretch justify-stretch
  transition-all  duration-200
  static;
  &:hover {
    @apply bg-light-100 dark:bg-dark-400;
  }
  & .container {
    @apply flex rounded-xl flex-wrap min-w-full items-stretch w-full relative pt-32;
    flex: 1 1 100%;
    background-color: v-bind(theColor);
  }
  & .info {
    @apply px-2 py-4 ml-2 m-2 z-4 max-w-20em bg-light-100 dark:bg-dark-100 rounded-lg;
    backdrop-filter: blur(10px) opacity(30%);
    flex: 1 1 100%;
  }
  & .title {
    @apply flex items-center flex-wrap;
  }
  & .subtitle {
    @apply mt-4 mb-2 p-2 font-normal w-full;
  }
  & .cover {
    @apply absolute top-0 w-full h-full bg-cover bg-center rounded-xl z-1;

    filter: saturate(50%) brightness(160%) opacity(30%);
    transition: all 900ms cubic-bezier(0.6, -0.1, 0, 1.1);
    flex: 1 0 100%;
    backgound: cover;
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