<script setup>
import { useDateFormat } from '@vueuse/core'
import { computed } from 'vue';

const props = defineProps({
  project: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  url: { type: String, default: '' },
  cover: { type: String, default: '' },
  poster: { type: String, default: '' },
  slug: { type: String, default: '' },
  youtube_video: { type: String, default: '' },
  date: { type: String, default: '' },
})

const formatted = useDateFormat(() => props?.date, 'DD MMMM YYYY (dddd)')

</script>

<template lang='pug'>
a.overflow-hidden.flex.flex-wrap.shadow-lg.hover-shadow-xl.transition.flex-1.dark-bg-dark-300.max-w-150.no-underline( :href="`/academy/events/${slug}/`" style="padding-bottom:0;padding-left:0; padding-right:0; flex: 1 1 auto" )
  .p-0.min-w-50.relative.flex.items-center.justify-center(style="flex: 1 0 ")
    .text-120px.flex.gap-2.absolute.p-2.opacity-80.invert.i-ic-round-play-circle( v-if="youtube_video")
    img(
      style="margin:0"
      :src="`https://db.chromatone.center/assets/${props.cover || props.poster}?fit=cover&width=600&height=600&format=webp`")
  .flex.flex-col.p-4.gap-2(style="flex: 1 1 100px")
    .text-sm.-mx-1
      span.bg-light-900.dark-bg-dark-600.px-1.py-1.rounded {{ project?.title }} 
    .text-2xl.font-bold.flex.items-center.gap-2 {{ title }}
    .text-lg {{ formatted }}

    .flex-1 
    .text-md {{ description }}


</template>

<style scoped>
a {
  text-decoration: none;
  font-weight: unset;
}
</style>