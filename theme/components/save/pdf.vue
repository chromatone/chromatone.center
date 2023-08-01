<script setup>
import { reactive, toRaw, ref } from 'vue'
const props = defineProps({
  svg: { type: String },
  x: { type: Number },
  y: { type: Number },
  width: { type: Number, default: 210 },
  height: { type: Number, default: 270 },
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
.snapshot
  .i-la-file-download(@click="savePDF(svg)")
  a(ref="anchor",target="_blank",:download="download.file",:href="download.url", v-if="download.url")
</template>

<style lang="postcss" scoped>
.snapshot {
  @apply flex cursor-pointer bg-gray-200 bg-opacity-70 dark-(bg-gray-800 bg-opacity-70) text-2xl -mt-1rem p-2 z-100 rounded-full;
}
</style>