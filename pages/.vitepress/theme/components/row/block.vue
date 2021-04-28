<template lang="pug">
.block(
  :title="item.lastModified",
  style="background-color: var(--c-bg-secondary);"
  v-motion,
  :initial="{ opacity: 0, y: 40 }",
  :enter="{ opacity: 0, y: 0, scale: 1 }",
  :visible="{ opacity: 1, y: 0, scale: 1 }",
  :delay="i * 80",
  :style="{ zIndex: i + 10 }"
  )
  a.flex.flex-col.min-content.flex-1(:href="item.link")
    .art.w-full.h-12em.bg-cover.bg-center.mb-8.rounded(v-if="item.data.media", :style="{ backgroundImage: 'url(' + item.media + ')' }", v-motion-fade)
    .flex.flex-1.self-stretch.flex-wrap.items-center
      .mr-2.text-2xl(v-if="item.data.emoji") {{ item.data.emoji }}
      h3.text-3xl.flex.items-center {{ item.title }}
      .px-2.mt-2(v-if="item.more") 
        radix-icons-text-align-left
      .flex-auto
      card-date(:date="item.lastModified")
    .text-md.mt-4.mb-2.font-normal(v-if="item.subtitle") {{ item.subtitle }}
    .text-xl.font-bold.rounded-xl.text-orange-800.p-2.mt-4(class="dark:text-orange-300",v-if="item.data.price") {{ item.data.price }}
  .mt-4.flex.flex-col.flex-auto.w-full( v-if="$site.customData.pages?.[item.data.list]")
    my-areas(:areas="$site.customData.pages?.[item.data.list]")
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  item: Object,
  i: Number
});
</script>

<style lang="postcss" scoped>
.block {
  @apply p-4 my-8 flex flex-col items-stretch shadow-lg static md:p-8;
}

.art {
  filter: saturate(10%) opacity(70%);
  transition: all 200ms ease-in-out;
}

.block:hover .art {
  filter: saturate(50%);
}

a:hover {
  text-decoration: none;
}
</style>