<script setup>
import { reactive, toRaw, ref } from 'vue'
const props = defineProps({
  svg: String,
  file: {
    type: String,
  },
  deep: Boolean
});

const anchor = ref('')

const download = reactive({
  file: props.file || props.svg,
  url: ''
})

function saveSVG(pic, deep) {

  let svg = document.getElementById(pic);
  if (deep) svg = svg.childNodes[0]
  if (!svg) return
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  download.url = url
  download.file = toRaw(props.file || props.svg)

  setTimeout(() => {
    anchor.value.click()
  }, 100);
}

</script>

<template lang="pug">
.snapshot
  .i-la-camera(@click="saveSVG(svg, deep)")
  a(ref="anchor",target="_blank",:download="download.file",:href="download.url", v-if="download.url")
</template>

<style lang="postcss" scoped>
.snapshot {
  @apply flex cursor-pointer bg-gray-200 bg-opacity-70 dark-(bg-gray-800 bg-opacity-70) text-2xl -mt-1rem p-2 z-100 rounded-full;
}
</style>