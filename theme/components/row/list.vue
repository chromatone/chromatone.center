<script setup>
import { lchToHsl } from '#/use/colors'
import { cleanLink } from 'vitepress-pages';
const props = defineProps(['children'])

</script>

<template lang="pug">
.flex.flex-col.max-w-full.mx-1.md-mx-2.gap-16.mt-12(v-if="children")
  .my-0(
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