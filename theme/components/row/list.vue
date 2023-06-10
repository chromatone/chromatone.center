<script setup>
import { lchToHsl } from '#/use/colors'
import { useRoute } from 'vitepress'
import { data } from '../../../content/pages.data.js'
import { cleanLink, useChildren } from 'vitepress-pages'

const route = useRoute()
const parents = useChildren(route, data)

</script>

<template lang="pug">
.list-blocks(v-if="list")
  .my-0(
    v-for="(block, i) in list",
    :key="block.url", 
    :id="block.url"
    :i="i"
    :total="list.length"
    )
    row-block(
      :item="block", 
      :color="lchToHsl(i, list.length)"
      )  
</template>

<style lang="postcss" scoped>
.list-blocks {
  @apply flex flex-col max-w-full mx-1 md-mx-2 gap-16 mt-8;
}
</style>
