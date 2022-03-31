<script setup lang="ts">

</script>

<template lang="pug">
header.home-hero.mt-16
  .w-full.max-w-600px.m-auto.p-4(
    )
      figure(
        v-if="$frontmatter?.icon"
        )
        img.block.w-auto(
          :src="$frontmatter.icon", 
          :alt="$frontmatter.heroAlt"
          )
</template>

