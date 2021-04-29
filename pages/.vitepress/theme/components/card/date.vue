<template lang="pug">
.text-sm.rounded-full.py-1.px-2.flex.items-center
  mdi-watering-can.mr-1.text-lg.opacity-50.text-green-800.transition(class="dark:text-green-200")
  .flex-1.font-normal {{ elapsed }}
</template>

<script lang="ts" setup>
import { defineProps, computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'

const props = defineProps({
  date: String,
});

const elapsed = useTimeAgo(new Date(props.date), {
  messages: {
    justNow: 'just now',
    past: n => n.match(/\d/) ? `${n}` : n,
    future: n => n.match(/\d/) ? `in ${n}` : n,
    month: (n) => `${n} mo`,
    year: (n) => `${n} y`,
    day: (n) => `${n} d`,
    week: (n) => `${n} w`,
    hour: (n) => `${n} h`,
    minute: (n) => `${n} m`,
    second: (n) => `${n} s`,
  }
});
</script>

<style lang="stylus" scoped>

</style>