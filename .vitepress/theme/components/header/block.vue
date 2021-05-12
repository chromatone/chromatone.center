<template lang="pug">
.header(:class="{ 'has-cover': $frontmatter.cover || $frontmatter.icon }")
  .cover(v-if="$frontmatter.cover",:style="{ backgroundImage: 'url(/media/' + $frontmatter.cover + ')' }", v-motion-fade)
  img.icon(v-if="$frontmatter.icon",:src="'/media/' + $frontmatter.icon")
  .meta
    page-parents
    .text-4xl.font-bold.mb-4.flex.flex-wrap.items-center(v-if="$frontmatter.title", v-motion-fade, :key="$frontmatter.title") 
      .mr-2 {{ $frontmatter.title }}
      .flex-1
      .mx-2.my-4.text-6xl(v-if="$frontmatter.emoji") {{ $frontmatter.emoji }}


    .font-bold.mt-2.mb-4(v-if="$frontmatter.subtitle") {{ $frontmatter.subtitle }}
    header-buttons(:buttons="$frontmatter?.buttons")
    shop-price(:product="$frontmatter?.product")
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({

});
</script>

<style scoped>
.header {
  @apply relative flex flex-col items-center;
}

.header.has-cover {
  @apply h-42em;
}

.has-cover .meta {
  @apply absolute bottom-0 w-full rounded-t-lg;
}

.cover {
  @apply transition-all duration-1000 bg-cover bg-center bg-gray-100 dark:(bg-gray-700) -z-5 fixed top-0 h-full left-0 right-0 bg-fixed;
  filter: saturate(50%) sepia(5%) opacity(40%) blur(40px);
}

.header:hover .cover {
  filter: saturate(60%) sepia(0%) opacity(90%);
}

.icon {
  @apply m-4 max-h-20em max-w-20em fixed;
}

.meta {
  @apply p-8 bg-gray-100 bg-opacity-85 z-10 max-w-65ch w-full mt-8 shadow-lg flex flex-col;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.dark .meta {
  @apply bg-true-gray-800 bg-opacity-85;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
</style>