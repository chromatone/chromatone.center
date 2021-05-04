<template lang="pug">
main
  .header(:class="{ 'has-cover': $frontmatter.cover }")
    .cover(v-if="$frontmatter.cover",:style="{ backgroundImage: 'url(/media/' + $frontmatter.cover + ')' }", v-motion-fade)
    img.icon(v-if="$frontmatter.icon",:src="'/media/' + $frontmatter.icon")
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
  footer-row
</template>

<script setup lang="ts">


</script>

<style lang="postcss" scoped>
main {
  @apply flex flex-col;
}

.header {
  @apply relative flex flex-col items-center;
}

.header.has-cover {
  @apply h-32em;
}

.has-cover .meta {
  @apply absolute bottom-0 w-full rounded-t-lg;
}

.meta {
  @apply bg-white bg-opacity-85 z-10 min-w-55ch;
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
  @apply transition-all duration-1000 bg-cover bg-center bg-gray-100 dark:(bg-gray-700) -z-5 fixed top-0 h-48em left-0 right-0 bg-fixed;
  filter: saturate(50%) sepia(5%) opacity(70%) blur(20px);
}

.header:hover .cover {
  filter: saturate(60%) sepia(0%) opacity(90%);
}

.icon {
  @apply m-4 max-h-20em max-w-20em;
}

.content {
  @apply p-8 max-w-55ch mx-auto flex flex-col pb-16;
}
</style>
