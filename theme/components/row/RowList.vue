<script setup>
import { lchToHsl } from '#/use/colors'
import { cleanLink } from '../../../pages/index';
const props = defineProps(['children'])

</script>

<template lang="pug">
.flex.flex-wrap.max-w-full.mx-1.md-mx-2.gap-8.mt-12(v-if="children")
  .my-0.flex.items-stretch(
    style="flex: 1 1 300px"
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