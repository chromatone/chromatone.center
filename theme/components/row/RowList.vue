<script setup>
import { lchToHsl } from '#/use/colors'

const props = defineProps({
  children: { type: Array, default: () => ([]) }
})

function cleanLink(url) {
  return (url || '').replace(/\/[^/]*\.(html)$/, '/')
}

</script>

<template lang="pug">
.flex.flex-wrap.gap-4
  .flex.items-stretch(
    v-for="(block, i) in children",
    :key="block.url", 
    style="flex: 1 1 220px"
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