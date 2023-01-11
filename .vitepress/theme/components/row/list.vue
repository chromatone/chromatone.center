<script setup>
import { useRoute } from 'vitepress'
import { pages } from '#/theme/composables/pages'
import { lchToHsl } from '#/use/colors'

const route = useRoute()

const list = pages[route.path]

</script>

<template lang="pug">
.list-blocks(v-if="list")
  .my-4(
    v-for="(block, i) in list",
    :key="block.title", 
    :id="block.title"
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
  @apply flex flex-col max-w-full mx-1;
}
</style>
