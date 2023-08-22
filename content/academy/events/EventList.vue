<script setup>
import { data } from './events.data'
import EventCard from './EventCard.vue'
const events = data.events
</script>

<template lang="pug">
.flex.flex-col.max-w-55ch.mx-4.sm-mx-8
  .p-0.flex.flex-col.gap-6
    .ml-4.text-2xl.font-bold 
    .flex.flex-col.gap-8
      EventCard(v-for="event in events", :key="event" v-bind="event")
</template>