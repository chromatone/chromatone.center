<script setup>
import { useDateFormat } from '@vueuse/core'
import { computed } from 'vue';

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  url: { type: String, default: '' },
  cover: { type: String, default: '' },
  poster: { type: String, default: '' },
  slug: { type: String, default: '' },
  youtube_video: { type: String, default: '' },
  start_date: { type: String, default: '' },
  end_date: { type: String, default: '' },
  field: { type: Array, default: [] },
  events: { type: Array, default: [] },
})

const from = useDateFormat(() => props?.start_date, 'DD MMM YYYY')
const to = props?.end_date ? useDateFormat(() => props?.end_date, 'DD MMM YYYY',) : 'Present'

</script>

<template lang='pug'>
a.overflow-hidden.flex.flex-wrap.shadow-lg.hover-shadow-xl.transition.flex-1.dark-bg-dark-300( :href="`/academy/projects/${slug}.html`" style="padding-bottom:0;padding-left:0; padding-right:0; flex: 1 1 auto" )
  .p-0.min-w-50.relative(style="flex: 0 0 ")
    .text-100px.flex.gap-2.absolute.top-11.left-10.p-2.opacity-80.i-ic-round-play-circle(v-if="youtube_video")
    img(
      style="margin:0"
      :src="`https://db.chromatone.center/assets/${props.cover || props.poster}?fit=cover&width=300&height=300&format=webp`")
  .flex.flex-col.p-4.gap-2(style="flex: 1 1 100px")
    .text-sm {{ from }} – {{ to }}
    .text-2xl.font-bold.flex.items-center.gap-2 {{ title }}
    .flex.flex-wrap.gap-2.items-center.capitalize
      .px-2.bg-light-800.dark-bg-dark-800.rounded(v-for="tag in field" :key="tag") {{ tag }} 
      .px-2.bg-light-500.dark-bg-dark-500.rounded(v-if="events.length>0") {{ events.length }} event{{ (events.length % 10 === 1 && events.length !== 11) ? '' : 's' }}
    .text-md.leading-normal {{ description }}


</template>

<style scoped>
a {
  text-decoration: none;
  font-weight: unset;
}
</style>