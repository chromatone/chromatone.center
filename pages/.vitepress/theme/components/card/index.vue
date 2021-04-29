<template lang="pug">
.crd(
  class="hover:shadow",
  :style="{ borderColor: lchToHsl(i, total)}"
  :title="item.lastModified",
  v-motion,
  :initial="{ opacity: 0, y: 40 }",
  :enter="{ opacity: 0, y: 0, scale: 1 }",
  :visible="{ opacity: 1, y: 0, scale: 1 }",
  :delay="i * 80",
  )
  .info
    .flex.flex-1.items-center.self-stretch.flex-wrap
      .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji}}
      a.text-xl.flex-auto(:href="item.link") {{ item.title }}
      edit-seen(:link="item.link")
      card-date(:date="item.lastModified")
    a.text-md.mt-4.mb-2.font-normal(v-if="item.subtitle", :href="item.link") {{ item.subtitle }}
    .text-xl.font-bold.rounded-xl.text-orange-800.p-2.mt-4(class="dark:text-orange-300",v-if="item.data.price") {{ item.data.price }}
  .media(v-if="item.data.media", :style="{ backgroundImage: 'url(' + item.media + ')' }", v-motion-fade) 
  line-list(:list="$site.customData.pages?.[item.data.list]")
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  item: Object,
  i: Number,
  total: Number,
});



import { lchToHsl } from '@composables/colors.js'
</script>

<style lang="postcss" scoped>
.crd {
  @apply my-4 flex flex-col rounded shadow-md border-l-4;
  transition: box-shadow color 100ms ease-in-out;
}

.info {
  @apply flex flex-col p-4 w-full;
}

.media {
  @apply bg-cover bg-center self-stretch min-h-8em;
  filter: saturate(10%) opacity(70%);
  transition: all 200ms ease-in-out;
  flex: 1 1 100px;
}

a:hover .art {
  filter: saturate(50%);
}

a:hover {
  text-decoration: none;
}
</style>