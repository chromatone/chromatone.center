<template lang="pug">
main
  page-header
  .content-container
    content.content
    shop-message
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
</style>
