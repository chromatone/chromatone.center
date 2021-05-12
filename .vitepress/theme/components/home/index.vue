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
</style>
