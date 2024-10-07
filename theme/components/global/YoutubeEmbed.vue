<script setup>
import { ref } from 'vue';

defineProps({
  video: { type: String }
});

const loaded = ref(false)


</script>

<template lang="pug">
.iframe-container.shadow-lg.rounded-lg.bg-cover.min-h-60()
  .flex.items-center.relative.w-full.bg-cover.cursor-pointer.op-80.hover-op-100.transition(
    v-if="!loaded"
    @click="loaded = true")
    img.w-full(:src="`https://img.youtube.com/vi/${video}/hqdefault.jpg`")
    .i-la-play-circle.text-xl
  iframe.overflow-hidden(
    v-else
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
  padding-top: 34%;
  position: relative;
}

.iframe-container iframe,
.iframe-container div {
  border: 0;
  height: 100%;
  left: 0;
  position: absolute;
  top: 0;
  width: 100%;
}
</style>