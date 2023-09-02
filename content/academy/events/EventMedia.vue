<script setup>
const props = defineProps({
  media: { type: Array, default: [] }
})

import { onMounted } from 'vue';
import { ref } from 'vue'

const hash = ref('')

onMounted(() => {
  const handleHashChange = () => {
    hash.value = window.location.hash.replace(/^#/, '')
  }
  window.addEventListener('hashchange', handleHashChange)
  handleHashChange()
})
</script>

<template lang='pug'>
details#media_downloads.m-2.p-2.max-w-160.text-sm.dark-bg-dark-400.bg-light-900.rounded-xl(v-if="media.length>0" :open="hash=='media_downloads'")
  summary.px-2.font-bold.text-lg.cursor-pointer.flex.items-center 
    .p-0 Media downloads
    .flex-1
    a(href="#media_downloads")
      .i-la-hashtag
  .flex.flex-col.gap-2.mt-4
    a.p-1.px-2.font-mono.bg-light-400.dark-bg-dark-200.shadow.rounded-md.flex.gap-2.flex.items-center.no-underline(
      v-for="file in media" :key="file"
      :href="`https://db.chromatone.center/assets/${file.directus_files_id.id}?download`"
      )
      .p-0(v-if="file.directus_files_id.type.includes('image')") 
        img(style="margin:0" :src="`https://db.chromatone.center/assets/${file.directus_files_id.id}?width=30&height=30&format=webp&fit=cover`")
      .p-0 {{ file.directus_files_id?.filename_download }}
      .flex-1
      .px-2.i-la-download
</template>
