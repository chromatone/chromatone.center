<template lang="pug">
header.home-hero(v-if="showHero")
  .w-45ch.m-auto(
    v-motion,
    :initial="{ opacity: 0, y: 40 }",
    :enter="{ opacity: 0, y: 0, scale: 1 }",
    :visible="{ opacity: 1, y: 0, scale: 1 }",)
    figure(
      v-if="$frontmatter.icon"
      )
      img.block.w-auto(
        :src="'/media/' + $frontmatter.icon", 
        :alt="$frontmatter.heroAlt"
        )
    .ml-2
      h1#main-title.text-4xl.mb-4.leading-10.text-center(v-if="hasHeroText") {{ heroText }}

      p.m-0.mt-1.text-xl.leading-6.text-center(v-if="hasTagline") {{ tagline }}
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSiteDataByRoute, useFrontmatter } from 'vitepress'

const site = useSiteDataByRoute()
const data = useFrontmatter()

const showHero = computed(() => {
  return (
    data.value.heroImage
    || hasHeroText.value
    || hasTagline.value
    || hasAction.value
  )
})

const hasHeroText = computed(() => data.value.heroText !== null)
const heroText = computed(() => data.value.heroText || site.value.title)

const hasTagline = computed(() => data.value.tagline !== null)
const tagline = computed(() => data.value.tagline || site.value.description)

const hasAction = computed(() => data.value.actionLink && data.value.actionText)
const hasAltAction = computed(
  () => data.value.altActionLink && data.value.altActionText,
)
</script>

<style scoped lang="postcss">
.home-hero {
  @apply pt-10 pb-11 px-4 md:px-6 text-center xs:py-14 md:(pt-16 pb-17) flex;
}

.links {
  @apply flex space-x-6 xs:(mt-12 );
}

.action {
  @apply inline-block mx-2;
}

.action :deep(.item) {
  @apply rounded-lg
    inline-block px-4 py-2.5
    text-lg text-white
    bg-$c-brand border-2px border-$c-brand transition-colors
    xs:(text-xl px-5 py-2.8);
}

.action.alt :deep(.item) {
  @apply bg-transparent text-$c-brand;
}

.action.alt :deep(.item:hover) {
  @apply text-$c-brand-light bg-transparent border-$c-brand-light;
}

.action :deep(.item:hover) {
  @apply no-underline bg-$c-brand-light border-$c-brand-light;
}
</style>
