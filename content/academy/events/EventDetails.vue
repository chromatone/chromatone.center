<script setup>
import { useDateFormat } from '@vueuse/core';

const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  poster: { type: String, default: '' },
  cover: { type: String, default: '' },
  date: { type: String, default: '' },
  start_time: { type: String, default: '' },
  duration: { type: String, default: '' },
  place: { type: Object, default: () => ({}) },
})

const formattedDate = useDateFormat(props.date, 'DD MMMM')

const year = useDateFormat(props.date, 'YYYY')

const weekDay = useDateFormat(props.date, 'dddd')
</script>

<template lang='pug'>
.flex.flex-col.gap-8.text-lg.mx-4.p-4.bg-light-100.dark-bg-dark-300.max-w-150.rounded-xl.shadow
  img(v-if="poster" style="margin:0;" :src=" `https://db.chromatone.center/assets/${poster}?format=webp`")
  .flex.flex-col.gap-2
    .flex.flex-col.gap-2 
      .text-3xl.font-bold {{ title }}
      .p-0 {{ description }}
    .flex-1.flex.gap-2.items-center 
      .i-la-clock
      .p-0.font-bold {{ start_time?.slice(0,-3) }} 
      .p-0 {{ weekDay }}
      .p-0.opacity-40 {{ duration }}
    .flex.flex-wrap.gap-2.items-center
      .i-la-calendar
      .p-0.font-bold(v-for="d in formattedDate.split(' ')" :key="d") {{ d }}
      .p-0 {{ year }}

    a.flex.items-center.gap-2.no-underline.font-normal(:href="`/academy/partners/${place?.slug}/`" v-if="place")
      .i-la-map-marker
      .p-0.font-bold {{ place?.title }},
      .p-0 {{ place?.city }},
      .p-0 {{ place?.country }}
  img(v-if="cover" style="margin:0;" :src="cover")
</template>