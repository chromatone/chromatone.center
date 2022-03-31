<script setup>
const props = defineProps({
  author: Object,
  i: Number,
  total: Number
});
</script>

<template lang="pug">
.rounded-2xl.author-card(v-if="author" :i="i" :total="total" :height="8")
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

<style lang="postcss" scoped>
.author-card {
  @apply max-w-65ch m-auto flex flex-col p-8 my-16 shadow-lg bg-light-100 dark_bg-dark-300;
}
.avatar {
  @apply h-12em self-start;
  flex: 0 1 120px;
  clip-path: url(#squircle);
}
</style>