<template lang="pug">
.author-card(v-if="author",
v-motion,
  :initial="{ opacity: 0, y: 40 }",
  :enter="{ opacity: 0, y: 0, scale: 1 }",
  :visible="{ opacity: 1, y: 0, scale: 1 }",
  )
  .flex.flex-wrap
    img.avatar(:src="author.avatar")
    .flex.flex-col.flex-1.justify-center
      .p-6.flex.flex-col
        .text-3xl.font-bold {{ author.name }}
        .pos.py-4.font-bold {{ author.pos }}
        .place.text-lg {{ author.place }}
      author-social(:social="author.social")
    .my-6 {{ author.about }}


svg.defs(style="height:0")
  defs
    clipPath#squircle(clipPathUnits="objectBoundingBox")
      path(d="M .5 0 C .1 0 0 .1 0 .5 0 .9 .1 1 .5 1 .9 1 1 .9 1 .5 1 .1 .9 0 .5 0 Z")
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  author: Object,
});
</script>

<style scoped>
.author-card {
  @apply flex flex-col shadow-lg p-8 my-16 bg-gray-50 dark:bg-gray-700;
}
.avatar {
  @apply h-12em self-start;
  flex: 0 1 120px;
  clip-path: url(#squircle);
}
</style>