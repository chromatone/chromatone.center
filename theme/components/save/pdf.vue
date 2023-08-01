<script setup>
import { reactive, toRaw, ref } from 'vue'
const props = defineProps({
  svg: { type: String },
  x: { type: Number },
  y: { type: Number },
  width: { type: Number, default: 210 },
  height: { type: Number, default: 297 },
});

const anchor = ref('')

const download = reactive({
  file: props.file || props.svg,
  url: ''
})

async function savePDF(pic) {
  let { x, y, width, height } = props
  let svg = document.getElementById(pic);
  console.log(svg)
  const { jsPDF } = await import('jspdf')
  await import('svg2pdf.js')

  const doc = new jsPDF()
  doc
    .svg(svg, {
      x,
      y,
      width,
      height
    })
    .then(() => {
      // save the created pdf
      doc.save('myPDF.pdf')
    })
}


</script>

<template lang="pug">
.snapshot(@click="savePDF(svg)")
  .i-la-file-download
  .text-xs.font-bold PDF
a(ref="anchor",target="_blank",:download="download.file",:href="download.url", v-if="download.url")
</template>

<style lang="postcss" scoped>
.snapshot {
  @apply flex items-center gap-2 cursor-pointer bg-light-400 dark-bg-dark-800 py-1 px-4 z-100 rounded-full;
}
</style>