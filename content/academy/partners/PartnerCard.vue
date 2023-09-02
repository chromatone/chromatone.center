<script setup>
const props = defineProps({
  title: { type: String, default: '' },
  slug: { type: String, default: '' },
  id: { type: String, default: '' },
  logo: { type: String, default: '' },
})
</script>

<template lang='pug'>
a.p-4.flex.items-center(style="flex:1 1 160px;" :href="`/academy/partners/${slug}/`")
  img.max-w-50(:src="`https://db.chromatone.center/assets/${logo}?width=300&format=webp`")

</template>