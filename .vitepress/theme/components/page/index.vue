<template lang="pug">
main
  header-block
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
</style>
