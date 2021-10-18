<template lang="pug">
.header(
  :class="{ 'has-cover': $frontmatter.cover || $frontmatter.icon }"
  :style="{ backgroundColor: pageColor }"
  )
  .cover(v-if="$frontmatter.cover",:style="{ backgroundImage: 'url(/media/' + $frontmatter.cover + ')', backgroundColor: pageColor }")
  img.icon(v-if="$frontmatter.icon",:src="'/media/' + $frontmatter.icon")
  .meta(:style="{ borderColor: pageColor }")
    page-parents.text-xl.mb-4
    .text-4xl.font-bold.mb-4.flex.flex-wrap.items-center(v-if="$frontmatter.title" :key="$frontmatter.title") 
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
import { isDark } from '@theme/composables/state'
const { current, total } = useSiblings();

const pageColor = computed(() => {
  let l = isDark.value ? 40 : 60
  return lchToHsl(current.value, total.value, 1, 20, l)
});

const lightColor = lchToHsl(current.value, total.value, 1, 70, 60);

</script>

<style scoped>
.header {
  @apply relative flex flex-col min-h-22rem pt-32 px-4 items-center overflow-hidden transition-all duration-400 ease-in;
}

.cover {
  @apply fixed overflow-hidden transition-all ease-in-out duration-500 bg-cover bg-center bg-gray-100 dark:(bg-gray-700) absolute top-0 h-full left-0 right-0;
  filter: saturate(20%) sepia(5%) opacity(10%) blur(0px);
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
  @apply relative p-8 mb-8 bg-gray-100 bg-opacity-95 z-3 max-w-65ch w-full mt-8 flex flex-col rounded-xl shadow-xl;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.dark .meta {
  @apply bg-true-gray-800 bg-opacity-85;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
</style>