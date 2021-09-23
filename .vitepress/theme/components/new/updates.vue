<template lang="pug">
.flex.flex-col.mx-4.items-center
  .max-w-55ch
    .text-xl Recent updates
    card-list(:rows="recent")
</template>

<script setup>
import { useData } from 'vitepress'
const { theme } = useData()
const recent = computed(() => {
  let all = theme.value.pages.all.filter(el => el.title && !el.hidden)
  let sorted = [...all].sort((a, b) => {
    if (a.lastModified < b.lastModified) {
      return 1
    } else {
      return -1
    }
  })
  return sorted.splice(0, 12)
});
</script>

<style scoped>
</style>