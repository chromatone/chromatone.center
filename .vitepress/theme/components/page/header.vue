<template lang="pug">
.header(
  :class="{ 'has-cover': $frontmatter.cover || $frontmatter.icon }"
  :style="{ borderColor: pageColor }"
  )
  .cover(v-if="$frontmatter.cover",:style="{ backgroundImage: 'url(/media/' + $frontmatter.cover + ')' }", v-motion-fade)
  img.icon(v-if="$frontmatter.icon",:src="'/media/' + $frontmatter.icon")
  .meta(:style="{ borderColor: pageColor }")
    page-parents.text-xl.mb-4
    .text-4xl.font-bold.mb-4.flex.flex-wrap.items-center(v-if="$frontmatter.title", v-motion-fade, :key="$frontmatter.title") 
      .mr-2 {{ $frontmatter.title }}
      .flex-1
      .mx-2.my-4.text-6xl(v-if="$frontmatter.emoji") {{ $frontmatter.emoji }}


    .font-bold.mt-2.mb-4(v-if="$frontmatter.subtitle") {{ $frontmatter.subtitle }}
    page-buttons(:buttons="$frontmatter?.buttons")
    .absolute.-bottom-2rem.right-2rem
      shop-price(:product="$frontmatter?.product" :color="lightColor")
</template>

<script setup>
import { useSiblings } from '../../composables/links.js'
import { lchToHsl } from '@use/colors.js'
const { current, total } = useSiblings();

const pageColor = lchToHsl(current, total, 1, 50, 50);
const lightColor = lchToHsl(current, total, 1, 70, 60);

</script>

<style scoped>
.header {
  @apply relative flex flex-col  items-center border-b-4;
}

.header.has-cover {
  @apply h-42rem;
}

.has-cover .meta {
  @apply absolute bottom-0 w-full rounded-md;
}

.cover {
  @apply transition-all ease-in-out duration-500 bg-cover bg-center bg-gray-100 dark:(bg-gray-700) -z-5 fixed top-0 h-full left-0 right-0;
  filter: saturate(20%) sepia(5%) opacity(90%) blur(10px);
}
@media print {
  .cover {
    @apply h-100px;
  }
}

.header:hover .cover {
  filter: saturate(70%) sepia(0%) opacity(90%) blur(0);
}

.icon {
  @apply m-4 max-h-20em max-w-20em fixed;
}

.meta {
  @apply relative p-8 mb-4 bg-gray-100 bg-opacity-95 z-3 max-w-65ch w-full mt-8 flex flex-col;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-width: 4px 4px 20px 4px;
}

.dark .meta {
  @apply bg-true-gray-800 bg-opacity-85;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
</style>