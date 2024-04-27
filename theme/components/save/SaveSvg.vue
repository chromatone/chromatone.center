<script setup>

import { useSVGFile } from '../../../use/download'

const props = defineProps({
  svg: String,
  file: {
    type: String,
  },
  deep: Boolean
});


const { anchor, download, saveSVG } = useSVGFile(props.file || props.svg)

</script>

<template lang="pug">
.snapshot(@click="saveSVG(svg, deep)")
  .i-la-camera
  slot
    .font-bold SVG
a(ref="anchor",target="_blank",:download="download?.file",:href="download?.url", v-if="download?.url") 
</template>

<style lang="postcss" scoped>
.snapshot {
  @apply flex items-center cursor-pointer gap-2 bg-light-400 dark-bg-dark-800 py-1 px-4 z-100 rounded-full;
}
</style>