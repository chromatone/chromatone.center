<script setup>
import { useDateFormat } from '@vueuse/core'
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  url: { type: String, default: '' },
  cover: { type: String, default: '' },
  slug: { type: String, default: '' },
  category: { type: Object, default: () => ({}) }
})


</script>

<template lang='pug'>
a.overflow-hidden.flex.flex-wrap.shadow-lg.hover-shadow-xl.transition.flex-1.dark-bg-dark-300( :href="`/shop-api/${category?.slug}/${slug}/`" style="padding-bottom:0;padding-left:0; padding-right:0; flex: 1 1 auto" )
  .p-0.min-w-50.relative(style="flex: 0 0 ")
    img(
      style="margin:0"
      :src="`https://db.chromatone.center/assets/${props.cover || props.poster}?fit=cover&width=300&height=300&format=webp`")
  .flex.flex-col.p-4.gap-2(style="flex: 1 1 100px")
    .text-2xl.font-bold.flex.items-center.gap-2 {{ title }}
    .text-md.leading-normal {{ description }}


</template>

<style scoped>
a {
  text-decoration: none;
  font-weight: unset;
}
</style>