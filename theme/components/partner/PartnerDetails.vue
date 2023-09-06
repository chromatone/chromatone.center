<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  logo: { type: String, default: '' },
  social: { type: Object, default: () => ({}) },
  url: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  full_address: { type: String, default: '' },
  gmap_link: { type: String, default: '' },
})
</script>

<template lang='pug'>
.flex.flex-col.gap-8.mx-4.bg-light-100.dark-bg-dark-300.max-w-150.rounded-xl.shadow

  img(v-if="logo" style="margin:0;" :src=" `https://db.chromatone.center/assets/${logo}?format=webp`")
  .flex.flex-col.gap-4.p-4
    .flex.flex-col.gap-4
      .text-3xl.font-bold {{ title }}
      .p-0.text-lg {{ description }}
    .p-2.flex.items-center.gap-2(v-if="url || social")
      .i-la-link.text-2xl.w-12
      a.no-underline(:href="url || social" target="_blank") {{ url || social }}
    a.p-2.rounded-lg.flex.items-center.gap-2.no-underline.font-normal.bg-light-900.bg-opacity-30(:href="gmap_link" target="_blank")
      .i-la-map-marker.text-2xl.w-12
      .p-0.text-sm(v-if="full_address") {{ full_address }}
      .p-0 {{ city }}
      .p-0.font-bold {{ country }}
  
</template>