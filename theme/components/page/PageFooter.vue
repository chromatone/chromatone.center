<script setup>
import { version } from '../../../package.json'
import { useRoute, useData } from "vitepress";
const { isDark, theme } = useData()
const route = useRoute()
</script>

<template lang='pug'>
.bg-dark-100.bg-op-30.dark-bg-dark-800.p-4.md-p-8.w-full.flex.dark-text-light-900.pb-6.items-center.gap-2.flex-wrap

  a.no-underline.flex.items-center.gap-4(href="/")
    img.w-6(v-if="theme.logo", :src="theme.logo", alt="Chromatone logo" title="Chromatone")
    .text-lg.font-bold.mr-2 Chromatone 
  a.no-underline.text-xl.flex.gap-1.items-center(
     v-tooltip="'Follow us on Instagram'"
    href="https://instagram.com/chromatone.center/" target="_blank")
    .i-la-instagram.-mb-1

  a.no-underline.flex.items-center(
    v-tooltip="'Read RSS Feed'"
    href="/feed.rss" target="_blank")
    .i-la-rss
  .flex-1 
  a.no-underline.flex.items-center(
    v-tooltip="'Edit page on GitHub'"
    :href="`https://github.com/chromatone/chromatone.center/tree/master/content${route.path}`" target="_blank")
    .i-la-edit
  a.no-underline.flex.items-center(
    v-tooltip="'Report an issue'"
    :href="`https://github.com/chromatone/chromatone.center/issues/new?title=${route.data?.title}&body=Issue at ${route.path}`" target="_blank") 
    .i-la-exclamation-circle
  .text-sm.mx-2 MIT © 2017-Present 

  a.no-underline.flex.gap-1.items-center(href="https://github.com/chromatone/chromatone.center/releases" target="_blank") 
    .text-sm v.{{ version }}
  a.no-underline.text-xl.flex.gap-1.items-center(href="https://github.com/chromatone/" target="_blank") 
    .i-la-github
  a.no-underline.flex.gap-1.items-center(href="https://www.npmjs.com/package/use-chromatone/" target="_blank") 
    .i-la-npm.-mb-1
</template>