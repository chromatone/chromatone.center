<script setup>
const props = defineProps(['pageColor', 'lightColor', 'page'])
</script>

<template lang="pug">
.header(
  v-if="!$frontmatter.misc"
  :class="{ 'has-cover': page?.cover || page?.icon }"
  :style="{ backgroundColor: pageColor }"
  )
  .cover(v-if="page?.cover",:style="{ backgroundImage: `url(${page?.cover})`, backgroundColor: pageColor }")
  img.icon(v-if="page?.icon",:src="page?.icon")
  .meta(:style="{ borderColor: pageColor }")

    slot

    .text-4xl.font-bold.mb-1.flex.flex-wrap.items-center(v-if="page?.title" :key="page.url") 
      .mr-2 {{ page?.title }}
      .flex-1
      .mx-2.my-4.text-6xl(v-if="page?.emoji") {{ page?.emoji }}
    .font-bold.mt-2.mb-4(v-if="page?.description") {{ page?.description }}
    page-buttons(:buttons="page?.buttons")
    .absolute.-bottom-2rem.right-2rem
      shop-price(
        :product="page?.product" 
        :title="page?.title" 
        :color="lightColor")
</template>

<style lang="postcss" scoped>
.header {
  @apply relative flex min-h-120 p-4 items-end overflow-hidden transition-all duration-400 ease-in;
}

.cover {
  @apply fixed overflow-hidden transition-all ease-in-out duration-500 bg-cover bg-center bg-gray-100 dark-(bg-gray-700) absolute top-0 h-full left-0 right-0;
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
  @apply relative p-8 mb-6 bg-light-100 bg-opacity-80 z-3 max-w-60ch w-full flex flex-col rounded-3xl shadow-xl dark-(bg-true-gray-800 bg-opacity-80);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}
</style>