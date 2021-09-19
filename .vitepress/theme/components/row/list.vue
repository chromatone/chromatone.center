<template lang="pug">
.list-blocks(v-if="rows")
  card-box.my-8.mx-2(
    v-for="(area,i) in rows",
    :key="area.title", 
    :id="area.title"
    :i="i"
    :total="rows.length"
    v-slot="{ color }"
    )
    row-block(
      :item="area", 
      :color="color"
      )  
</template>

<script setup>
import { useData } from 'vitepress'
const { theme, title, frontmatter } = useData()

const rows = theme.value?.pages?.[frontmatter.value.list];

</script>

<style  scoped>
.list-blocks {
  @apply flex flex-col max-w-65ch mx-auto;
}
</style>
