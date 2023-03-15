<script setup lang="ts">
import { useData, useRoute } from 'vitepress'
import { pages } from '#/theme/composables/pages'

const { site, theme } = useData()
const route = useRoute()
</script>

<template lang="pug">
footer.flex.items-center.px-4.py-4
  a.text-xl.p-4.flex.items-center(
    class="hover-no-underline"
    href="/"
    )
    img.w-32(src="/media/logo/circle.svg")
    .p-2 Chromatone
  .flex-1
  //- iframe.mr-12(src="https://github.com/sponsors/chromatone/button", title="Sponsor chromatone", height="32", width="114", style="border: 0; border-radius: 6px;")
</template>

<style scoped lang="postcss"></style>

