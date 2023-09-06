<script setup>
import EventCard from './EventCard.vue'
import { reactive } from 'vue';
import { computed } from 'vue';

const props = defineProps({
  events: { type: Array, default: () => ([]) },
  projects: { type: Array, default: () => ([]) },
})

const projects = computed(() => props.projects.filter(p => p.events.length > 0))

const filters = reactive(props.projects.map(p => p.slug))

const filtered = computed(() => props.events.filter(ev => filters.includes(ev.project.slug)))

function toggleFilter(slug) {
  let index = filters.findIndex(v => v == slug)
  if (index == -1) {
    filters.push(slug)
  } else {
    filters.splice(index, 1)
  }
}

</script>

<template lang="pug">
.flex.flex-col.max-w-55ch.mx-4.sm-mx-8
  .p-0.flex.flex-col.gap-8
    .flex.flex-col.gap-2.bg-light-900.p-2.dark-bg-dark-200.rounded
      .p-2 Showing {{ filtered.length }} / {{ events.length }} events in {{ filters.length }} projects
      .flex.flex-wrap.gap-2
        .px-2.rounded-full.bg-light-700.shadow.dark-bg-dark-800.opacity-50.border-1.border-transparent.cursor-pointer.flex.items-center.gap-2(
          v-for="project in projects" 
          :key="project.id" 
          @click="toggleFilter(project.slug)"
          :class="{active:filters.find(el=>el==project.slug)}"
          ) {{ project.title }}
            .text-xs.text-center.rounded-full.font-bold.bg-light-300.dark-bg-dark-500.w-6 {{ project.events.length }}

    .flex.flex-col.gap-8
      transition-group(name="fade")
        EventCard(v-for="event in filtered", :key="event" v-bind="event")
</template>

<style scoped lang="postcss">
.active {
  @apply border-dark-300 dark-border-light-900 opacity-100 border-opacity-50 dark-border-opacity-60
}
</style>