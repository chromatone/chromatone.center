<template lang="pug">
.crd(
  :style="{ borderColor: lchToHsl(i, total) }"
  :title="item.lastModified",
  v-motion,
  :initial="{ opacity: 0, y: 40 }",
  :enter="{ opacity: 0, y: 0, scale: 1 }",
  :visible="{ opacity: 1, y: 0, scale: 1 }",
  :delay="i * 80",
  )
  a.flex(:href="item.link")
    .info
      .flex.flex-1.items-center.self-stretch.flex-wrap
        .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
        .text-xl.flex-auto {{ item.title }}
        card-date(:date="item.lastModified")
      .text-md.mt-4.mb-2.font-normal(v-if="item.subtitle") {{ item.subtitle }}
      .text-xl.font-bold.rounded-xl.text-orange-800.p-2.mt-4(class="dark:text-orange-300",v-if="item.data.price") {{ item.data.price }}
    .media(v-if="item.data.media", :style="{ backgroundImage: 'url(/media/' + item.data.media + ')' }", v-motion-fade) 
  line-list(:list="$site.customData.pages?.[item.data.list]")
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});

import { useLocalStorage } from '@vueuse/core'


import { lchToHsl } from '@composables/colors.js'
</script>

<style lang="postcss" scoped>
.crd {
  @apply my-4 flex flex-col rounded shadow-md border-l-4 hover:shadow;
  transition: box-shadow color 100ms ease-in-out;
}

.crd.seen {
  @apply opacity-70;
}

.info {
  @apply flex flex-col p-4 w-full;
}

.media {
  @apply bg-cover bg-center self-stretch min-h-4em min-w-6em;
  filter: saturate(10%) opacity(70%);
  transition: all 200ms ease-in-out;
  flex: 1 1 100px;
}

.crd:hover .media {
  filter: saturate(100%) opacity(100%);
}

a:hover .art {
  filter: saturate(50%);
}

a:hover {
  text-decoration: none;
}
</style>