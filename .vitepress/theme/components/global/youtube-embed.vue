<template lang="pug">
iframe.shadow-2xl.rounded-lg.mx-auto.my-2(
  loading="lazy"
  width="320", 
  height="200", 
  :src="`https://www.youtube-nocookie.com/embed/${video}`", 
  title="YouTube video player", 
  frameborder="0", 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", 
  allowfullscreen
  )
</template>

<script setup>
defineProps(['video']);
</script>

<style scoped>
</style>