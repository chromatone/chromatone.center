<script setup>
const props = defineProps({
  schedule: { type: Object, default: () => ({}) }
})
</script>

<template lang='pug'>
table.max-w-55ch(v-if="schedule")
  tbody
    tr.text-xl.font-bold
      td.p-4(colspan="3") Event schedule
    tr
      th Time
      th Activity
      th Duration

    tr(v-for="act in schedule", :key="act")
      td(width="60px") {{act?.time?.slice(0,-3)}}
      td(width="100%", :colspan="act?.duration? 1: 2" :class="{'font-bold':act?.time}") {{act?.activity}}
      td.opacity-60(v-if="act?.duration" width="50px") {{act.duration}}
</template>