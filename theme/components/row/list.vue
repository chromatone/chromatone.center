<script setup>
import { lchToHsl } from '#/use/colors'

const props = defineProps(['children'])

</script>

<template lang="pug">
.flex.flex-col.max-w-full.mx-1.md-mx-2.gap-16.mt-8(v-if="children")
  .my-0(
    v-for="(block, i) in children",
    :key="block.url", 
    :id="block.url"
    :i="i"
    :total="children.length"
    )
    row-block(
      :item="block", 
      :color="lchToHsl(i, children.length)"
      )  
</template>

<style></style>