<script setup>
import { version } from '../../../package.json'
import { useRoute, useData } from "vitepress";
const { isDark, theme } = useData()
</script>

<template lang='pug'>
.bg-dark-100.bg-op-30.dark-bg-dark-800.p-4.md-p-8.w-full.flex.items-end.gap-4.dark-text-light-900

  a.no-underline.flex.items-center.gap-4(href="/")
    img.w-16(v-if="theme.logo", :src="theme.logo", alt="Chromatone logo" title="Chromatone")
    .flex.flex-col
      .text-2xl.font-bold Chromatone 
      .text-lg Visual Music Language 
  .flex-1
  a.no-underline.text-sm(href="https://github.com/chromatone/chromatone.center/releases" target="_blank") v.{{ version }}

  .text-md 2017-Present
</template>