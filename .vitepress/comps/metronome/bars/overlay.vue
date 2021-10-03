<template lang="pug">
g.question.cursor-pointer(
  @click="overlay = true"
)
  rect(
    width="70"
    height="80"
    stroke="currentColor"
    fill="transparent"
    rx="10"
    stroke-width="4"
    )
  g.icon(
    font-size="45"
    fill="currentColor"
    transform="translate(6,12)"
  )
    healthicons-question
</template>

<script setup>

</script>

<style scoped>
</style>