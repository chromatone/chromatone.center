<script setup>
const props = defineProps({
  author: Object,
  i: Number,
  total: Number
});
</script>

<template lang="pug">
.rounded-2xl.author-card.m-4.overflow-hidden(v-if="author" :i="i" :total="total" :height="8")
  .flex.flex-wrap.items-center.p-4
    img.avatar(:src="author.avatar")
    .flex.flex-col.justify-center(style="flex: 10 1 220px")
      .p-6.flex.flex-col
        .text-3xl.font-bold {{ author.name }}
        .pos.py-4.font-bold {{ author.pos }}
        .place.text-lg {{ author.place }}
    .p-2 {{ author.about }}
    .p-2(v-if="author?.interactions") 
      .font-bold.border-b-1.border-current.border-opacity-10 Available interactions
      .flex.gap-2.py-4.flex-wrap
        .px-2.py-1.bg-light-400.rounded-xl.shadow.dark_bg-dark-400(v-for="interaction in author?.interactions" :key="interaction") {{interaction}}
  .p-2.bg-dark-200.bg-opacity-10.dark_bg-light-200.dark_bg-opacity-10
    author-social(:social="author.social")



svg.defs(style="height:0")
  defs
    clipPath#squircle(clipPathUnits="objectBoundingBox")
      path(d="M .5 0 C .1 0 0 .1 0 .5 0 .9 .1 1 .5 1 .9 1 1 .9 1 .5 1 .1 .9 0 .5 0 Z")
</template>

<style lang="postcss" scoped>
.author-card {
  @apply max-w-65ch m-auto flex flex-col  my-16 shadow-lg bg-light-100 dark_bg-dark-300;
}
img.avatar {
  @apply self-start ;
  flex: 1 1 120px;
  clip-path: url(#squircle);
}
</style>