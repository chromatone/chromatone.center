<script setup>
import { version } from '../../../package.json'
import { useRoute, useData } from "vitepress";
const { isDark, theme } = useData()
</script>

<template lang='pug'>
.bg-dark-100.bg-op-30.dark-bg-dark-800.p-4.md-p-8.w-full.flex.dark-text-light-900.pb-6.items-center.gap-2

  a.no-underline.flex.items-center.gap-4(href="/")
    img.w-6(v-if="theme.logo", :src="theme.logo", alt="Chromatone logo" title="Chromatone")
    .text-lg.font-bold.mr-2 Chromatone 
  .flex-1
  .text-sm.mx-2 © 2017-Present
  a.no-underline.text-sm.flex.gap-1.items-center(href="https://www.npmjs.com/package/use-chromatone/" target="_blank") v.{{ version }}
  a.no-underline.text-md.flex.gap-1.items-center(href="https://github.com/chromatone/chromatone.center/" target="_blank") 
    .i-la-github
  a.no-underline.text-md.flex.gap-1.items-center(href="https://instagram.com/chromatone.center/" target="_blank")
    .i-la-instagram
</template>