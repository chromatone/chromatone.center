<template lang="pug">
main
  .header
    .cover(:style="{ backgroundImage: 'url(' + getMedia($frontmatter.cover) + ')' }", v-motion-fade)
    .meta.content
      page-parents
      .text-4xl.font-bold.mb-4.flex.flex-wrap.items-center(v-if="$frontmatter.title", v-motion-fade, :key="$frontmatter.title") 
        .mr-2 {{ $frontmatter.title }}
        .flex-1
        .mx-2.my-4.text-6xl {{ $frontmatter.emoji }}
      .flex.items-center(v-if="$frontmatter.price")
        .text-xl.font-bold.rounded-xl.text-orange-800.p-2.mr-2(class="dark:text-orange-200") {{ $frontmatter.price }}
        a.text-xl.font-bold.rounded-xl.bg-orange-300.px-2.py-1(href="/contact") Заказать
      .font-bold.mt-2.mb-4(v-if="$frontmatter.subtitle") {{$frontmatter.subtitle}}
  .info
    content.content
    row-list(
    v-if="$frontmatter.list", 
    :rows="$site.customData.pages?.[$frontmatter.list]"
    )
    page-next-prev
  page-footer
</template>

<script setup lang="ts">
function getMedia(path) {
  if (path) {
    return '/media/' + path
  } else {
    return '/media/art/sean-sinclair.jpg'
  }
}




</script>

<style lang="postcss" scoped>
main {
  @apply flex flex-col;
}

.header {
  @apply relative flex flex-col items-center h-62vh;
}

.meta {
  @apply bg-white bg-opacity-85 absolute bottom-0 w-full rounded-t-lg z-10;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.dark .meta {
  @apply bg-true-gray-800 bg-opacity-85;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}

.info {
  @apply bg-white dark:bg-gray-800 pb-32 shadow-2xl z-3;
}

.cover {
  @apply transition-all bg-cover bg-center bg-gray-100 dark:(bg-gray-700) -z-5 fixed top-0 h-70vh left-0 right-0 bg-fixed;
  filter: saturate(50%) sepia(5%) opacity(70%);
}

.header:hover .cover {
  filter: saturate(60%) sepia(0%) opacity(90%);
}

.content {
  @apply p-8 max-w-55ch mx-auto flex flex-col pb-16;
}
</style>
