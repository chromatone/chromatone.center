<template lang="pug">
.list-blocks(v-if="rows")
  .my-12.mx-2.shadow-xl.rounded-xl(
    v-for="(area,i) in rows",
    :key="area.title", 
    :id="area.title"
    :i="i"
    :total="rows.length"
    )
    row-block(
      :item="area", 
      :color="lchToHsl(i, rows.length)"
      )  
</template>

<script setup>
import { useData } from 'vitepress'
import { lchToHsl } from '@use/colors'
const { theme, title, frontmatter } = useData()

const rows = theme.value?.pages?.[frontmatter.value.list];

</script>

<style  scoped>
.list-blocks {
  @apply flex flex-col max-w-65ch mx-auto w-full;
}
</style>
