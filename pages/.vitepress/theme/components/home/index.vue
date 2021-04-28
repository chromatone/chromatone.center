<template lang="pug">
main(aria-labelledby="main-title")
  home-hero
  content
  row-list(
    v-if="$frontmatter.list", 
    :rows="$site.customData.pages?.[$frontmatter.list]"
    )
  home-footer
</template>

<script setup lang="ts">

</script>

<style scoped lang="postcss">
.content {
  @apply max-w-65ch mx-auto p-6 md:(p-12)  bg-gray-50 bg-opacity-96 dark:(bg-warm-gray-900 bg-opacity-96);
}
</style>
