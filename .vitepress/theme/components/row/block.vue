<template lang="pug">
.row(
  :id="item.title"
  :style="{ zIndex: i + 10, borderColor: rowColor }"
  )
  a.header(:href="item.link")
    .cover(v-if="item.data?.cover", :style="{ backgroundImage: 'url(/media/' + item.data?.cover + ')' }", v-motion-fade)
    .info
      .flex.items-center.w-full(
        :style="{ color: rowColor }"
      )
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        h3
          span.text-3xl {{ item.title }} 
          span.px-2.mt-2(v-if="item.more") 
            radix-icons-text-align-left
        .flex-1
        shop-price(:product="item.data?.product" :color="rowColor")

        card-date(v-if="!item.data?.product",:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal.w-full(v-if="item.subtitle") {{ item.subtitle }}
      page-buttons(:buttons="item.data?.buttons" :color="rowColor")

  card-list(v-if="site.customData.pages?.[item.data?.list]",:rows="site.customData.pages?.[item.data?.list]")

</template>

<script setup>
import { useData } from 'vitepress'
const { site, title, theme } = useData()
import { lchToHsl } from '../../composables/colors.js'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

const rowColor = lchToHsl(props.i, props.total);

</script>

<style scoped>
.row {
  @apply my-8 shadow-md rounded-sm mx-2 md:mx-0 sm:mx-4 bg-light-200 dark:bg-dark-200
  flex flex-col items-stretch 
  transition-all
  static;
  border-width: 2px 2px 10px 2px;
}

.header {
  @apply flex flex-wrap flex-1;
}

.info {
  @apply my-4 relative min-w-320px flex self-stretch flex-wrap items-center p-4 md:(px-8 py-4);
  flex: 1 1 45%;
}

.cover {
  @apply w-full min-h-12em bg-cover bg-center rounded;
  filter: saturate(50%) opacity(50%);
  transition: all 300ms ease-in-out;
  flex: 1 1 30%;
}

.row:hover .cover {
  filter: saturate(100%) opacity(90%);
}

a:hover {
  text-decoration: none;
}
</style>