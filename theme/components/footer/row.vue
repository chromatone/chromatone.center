<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { pages } from '#/theme/composables/pages'

const { site, theme } = useData()
const route = useRoute()
</script>

<template lang="pug">
footer.flex.items-center.px-4.py-4
  a.text-xl.p-4.flex.items-center.gap-2(
    class="hover-no-underline"
    href="/"
    )
    img.w-16(src="/media/logo/click-logo.svg")
    .p-2 Chromatone
  .flex-1

</template>

<style scoped lang="postcss"></style>

