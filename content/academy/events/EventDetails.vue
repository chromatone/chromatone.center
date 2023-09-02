<script setup>
import { useDateFormat } from '@vueuse/core';

const props = defineProps({
  date: { type: String, default: '' },
  start_time: { type: String, default: '' },
  duration: { type: String, default: '' },
  place: { type: Object, default: () => ({}) },
})

const formattedDate = useDateFormat(props.date, 'dddd DD MMMM YYYY')
</script>

<template lang='pug'>
.flex.flex-col.gap-4.text-xl.mx-4.p-4.bg-light-100.dark-bg-dark-300.max-w-150.rounded-xl.shadow
  .flex.flex-wrap.gap-2
    .p-0.font-bold {{ start_time?.slice(0,-3) }}
    .p-0(v-for="d in formattedDate.split(' ')" :key="d") {{ d }}
    //- .p-0 {{ duration }}
  a.flex.items-center.gap-2(:href="`/academy/partners/${place?.slug}/`")
    .p-0.font-bold {{ place?.title }}
    .p-0 {{ place?.city }} 
    .p-0 {{ place?.country }}
</template>