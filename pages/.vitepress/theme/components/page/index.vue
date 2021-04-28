<template lang="pug">
main
  .art.h-md.bg-cover.sticky.-z-1(class="top-$header-height",v-if="$frontmatter.media", :style="{ backgroundImage: 'url(' + $frontmatter.media + ')' }", v-motion-fade)
  .bg-white(class="dark:bg-gray-800")
    .content(:class="{ 'full-width': $frontmatter.fullWidth }")
      page-parents
      .text-4xl.font-bold.mb-4.flex.flex-wrap.items-center(v-if="$frontmatter.title", v-motion-fade, :key="$frontmatter.title") 
        .mr-2 {{ $frontmatter.title }}
        .flex-1
        .mx-2.my-4.text-6xl {{ $frontmatter.emoji }}
      .flex.items-center(v-if="$frontmatter.price")
        .text-xl.font-bold.rounded-xl.text-orange-800.p-2.mr-2(class="dark:text-orange-200") {{ $frontmatter.price }}
        a.text-xl.font-bold.rounded-xl.bg-orange-300.px-2.py-1(href="/contact") Заказать
      .font-bold.mt-2.mb-4(v-if="$frontmatter.subtitle") {{$frontmatter.subtitle}}
      content
    row-list(
      v-if="$frontmatter.list", 
      :rows="$site.customData.pages?.[$frontmatter.list]"
      )

  page-footer
  page-next-prev
</template>

<script setup lang="ts">


</script>

<style lang="postcss" scoped>
main {
  @apply mb-4;
}

.art {
  filter: saturate(30%) sepia(5%);
}

.content {
  padding-bottom: 1.5rem;
  @apply p-8 max-w-55ch mx-auto flex flex-col pb-16;
}

.content.cards {
  @apply max-w-65ch mx-auto;
}
</style>
