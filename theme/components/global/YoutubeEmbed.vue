<script setup>
defineProps(['video']);
</script>

<template lang="pug">
.iframe-container.shadow-lg.rounded-lg
  iframe.overflow-hidden(
    loading="lazy"
    :src="`https://www.youtube-nocookie.com/embed/${video}`", 
    title="YouTube video player", 
    frameborder="0", 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", 
    allowfullscreen
    )
</template>

<style lang="postcss" scoped>
.iframe-container {
  max-width: 65ch;
  overflow: hidden;
  /* 16:9 aspect ratio */
  padding-top: 56.25%;
  position: relative;
}

.iframe-container iframe {
  border: 0;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>