<script setup>
import { data } from './tools.data'
</script>

<template lang='pug'>
.flex.flex-wrap.gap-4.max-w-60ch
  a.p-2.flex.gap-2.bg-light-200.hover-bg-light-100.shadow-md.hover-shadow-lg.dark-bg-dark-300.dark-hover-bg-dark-400.rounded.border-1.dark-border-dark-100(
    v-for="tool in data" :key="tool"
    :href="tool.url"
    target="_blank"
    flex="1 1 100px"
    )
    .p-0.flex.items-center(style="flex: 0 0 180px")
      img(
        style="margin:0"
        :src="`https://db.chromatone.center/assets/${tool?.cover}?quality=70&width=600&format=webp`")
    .flex.flex-col.gap-2.p-2
      .text-xl.font-bold {{ tool.title }}
      .text-xs.opacity-50.hover-opacity-100.transition {{ tool.url }}
      .text-sm {{ tool.description }}
</template>

<style scoped>
a {
  text-decoration: none;
  font-weight: unset;
}
</style>