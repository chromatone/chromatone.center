<script lang="ts" setup>
import { computed } from 'vue'
import { useTimeAgo } from '@vueuse/core'

const props = defineProps({
  date: String,
});

const diff = computed(() => {
  return Date.now() - new Date(props.date).getTime()
})


const superFresh = computed(() => {
  return diff.value < 1000 * 60 * 60 * 24
})


const fresh = computed(() => {
  return diff.value < 1000 * 60 * 60 * 24 * 7
})

const elapsed = useTimeAgo(new Date(props.date), {
  messages: {
    justNow: ' now',
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

<template lang="pug">
.text-sm.rounded-full.flex.items-center(v-if="fresh")
  .i-mdi-watering-can.can(v-if="superFresh")
  .i-mdi-watering-can-outline.can(v-else)
  .flex-1.font-normal {{ elapsed }}
</template>

<style lang="postcss" scoped>
.can {
  @apply text-lg opacity-50 text-green-800 transition-all dark-text-green-200;
}
</style>