<template lang="pug">
main.mb-16(aria-labelledby="main-title")
  home-hero
  content.content
  tile-list(
    v-if="$frontmatter.list", 
    :rows="$site.customData.pages?.[$frontmatter.list]"
    )
</template>

<script setup lang="ts">

</script>

<style scoped lang="postcss">
.content {
  @apply p-8 max-w-55ch mx-auto flex flex-col pb-16;
}
</style>
