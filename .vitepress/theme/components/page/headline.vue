<script setup>
import { useSiblings, usePage } from '../../composables/pages'
import { lchToHsl } from '#/use/colors.js'
import { isDark } from '#/theme/composables/state'
import { useRoute } from 'vitepress'

const route = useRoute()

const page = computed(() => usePage(route.path))

const siblings = computed(() => useSiblings(route.path));

const pageColor = computed(() => {
  let l = isDark.value ? 40 : 60
  return lchToHsl(siblings.value.index, siblings.value.total, 1, 20, l)
});

const lightColor = computed(() => lchToHsl(siblings.value.index, siblings.value.total, 1, 70, 60));

</script>

<template lang="pug">
.header(
  :class="{ 'has-cover': page?.cover || page?.icon }"
  :style="{ backgroundColor: pageColor }"
  )
  .cover(v-if="page?.cover",:style="{ backgroundImage: `url(${page.cover})`, backgroundColor: pageColor }")
  img.icon(v-if="page?.icon",:src="page.icon")
  .meta(:style="{ borderColor: pageColor }")
    page-parents.text-xl.mb-4
    .text-4xl.font-bold.mb-4.flex.flex-wrap.items-center(v-if="page?.title" :key="page.path") 
      .mr-2 {{ page?.title }}
      .flex-1
      .mx-2.my-4.text-6xl(v-if="page?.emoji") {{ page.emoji }}
    .font-bold.mt-2.mb-4(v-if="page?.subtitle") {{ page.subtitle }}
    page-buttons(:buttons="page?.buttons")
    .absolute.-bottom-2rem.right-2rem
      shop-price(:product="page?.product" :color="lightColor")
</template>

<style lang="postcss" scoped>
.header {
  @apply relative flex flex-col min-h-22rem pt-32 px-4 items-center overflow-hidden transition-all duration-400 ease-in;
}

.cover {
  @apply fixed overflow-hidden transition-all ease-in-out duration-500 bg-cover bg-center bg-gray-100 dark_(bg-gray-700) absolute top-0 h-full left-0 right-0;
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
  @apply relative p-8 mb-8 bg-light-100 bg-opacity-80 z-3 max-w-65ch w-full mt-8 flex flex-col rounded-3xl shadow-xl dark_(bg-true-gray-800 bg-opacity-80);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
</style>