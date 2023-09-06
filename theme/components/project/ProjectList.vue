<script setup>
import ProjectCard from './ProjectCard.vue'

const props = defineProps({
  projects: { type: Array, default: () => ([]) }
})
</script>

<template lang="pug">
.flex.flex-col.max-w-55ch.mx-4.sm-mx-8
  .p-0.flex.flex-col.gap-6
    .ml-4.text-2xl.font-bold 
    .flex.flex-col.gap-8
      ProjectCard(v-for="project in projects", :key="project" v-bind="project")
</template>