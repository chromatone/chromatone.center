<template lang="pug">
.flex.flex-wrap
  .flex-1(v-for="page in parents", :key="page.title") 
    a.flex.items-center(:href="page.link") 
      carbon-arrow-up.mr-1
      span {{ page.title }}
</template>

<script setup>
import { useParents } from '../../composables/links.js'

const parents = useParents();
</script>

<style  scoped>
</style>