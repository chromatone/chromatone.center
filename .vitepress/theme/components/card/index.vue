<template lang="pug">
.crd(
  :style="{ borderColor: lchToHsl(i, total) }"
  :title="item.lastModified",
  )
  a.flex(:href="item.link")
    .info(
      v-motion,
      :initial="{ opacity: 0, y: 10 }",
      :enter="{ opacity: 0, y: 0, scale: 1 }",
      :visible="{ opacity: 1, y: 0, scale: 1 }",
      )
      .flex.flex-1.items-center.self-stretch.flex-wrap
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        .text-2xl.flex-auto {{ item.title }}
        card-date(v-if="!item.data.product",:date="item.lastModified")

      .text-md.mt-4.mb-2.font-normal(v-if="item.subtitle") {{ item.subtitle }}
      shop-price.float-left(:product="item.data?.product", :showButton="false")

    .cover(v-if="item.data.cover", :style="{ backgroundImage: 'url(/media/' + item.data.cover + ')' }", v-motion-fade)

  page-buttons(:buttons="item.data?.buttons")
  line-list(:list="$site.customData.pages?.[item.data.list]")
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

import { lchToHsl } from '@theme/composables/colors.js'
</script>

<style lang="postcss" scoped>
.crd {
  @apply my-4 relative transition-all bg-white dark:bg-gray-900 flex flex-col rounded-md shadow-md hover:shadow-lg;
  transition: box-shadow color 100ms ease-in-out;
}

.crd.seen {
  @apply opacity-70;
}

.info {
  @apply p-4 my-auto;
}

.cover {
  @apply bg-cover bg-center self-stretch min-h-16em sm:min-w-16em min-w-6em rounded-xl m-2;
  flex-basis: 6em;
  filter: saturate(10%) opacity(70%);
  transition: all 200ms ease-in-out;
  flex: 1 1 100px;
}

.crd:hover .cover {
  filter: saturate(60%) opacity(80%);
}

a:hover .art {
  filter: saturate(50%);
}

a:hover {
  text-decoration: none;
}
</style>