<script setup>
import { routes } from '@theme/composables/pages'
const recent = computed(() => {
  let all = routes.filter(el => el.title && !el.hidden)
  let sorted = [...all].sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
  return sorted.splice(0, 12)
});
</script>

<template lang="pug">
.flex.flex-col.mx-4.items-center
  .max-w-55ch
    .text-xl Recent updates
    card-list(:rows="recent")
</template>

<style scoped>
</style>