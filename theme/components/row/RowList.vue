<script setup>
import { lchToHsl } from '#/use/colors'

const props = defineProps(['children'])
function cleanLink(url) {
  return (url || '').replace(/\/[^/]*\.(html)$/, '/')
}

</script>

<template lang="pug">
.flex.flex-wrap.max-w-full.mx-1.md-mx-2.gap-4.my-4(v-if="children")
  .flex.items-stretch(
    style="flex: 1 1 240px"
    v-for="(block, i) in children",
    :key="block.url", 
    :id="cleanLink(block.url)"
    :i="i"
    :total="children.length"
    )
    row-block(
      :item="block", 
      :color="lchToHsl(i, children.length)"
      )  
</template>

<style></style>