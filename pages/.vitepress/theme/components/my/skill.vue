<template lang="pug">
.flex.flex-col.p-4
  .flex.py-2.items-center

  .flex-1.text-lg {{ skill?.title }} {{ skill?.icon }} 

  .text-md.text-right {{ skill?.interest }} 

  .flex.relative.bg-gray-100.rounded-full.items-center

    .flex-1.bg-lime-300.pl-2.rounded-full(:style="{ maxWidth: skill?.current / skill?.total * 100 + '%' }") &nbsp;

    .absolute.right-1em(v-if="skill?.current") {{ skill?.current }} / {{ skill?.total || 12 }}

  .text-sm.m-2(v-if="skill?.comment") {{ skill?.comment }}
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  skill: Object
});

</script>

<style lang="postcss" scoped>
</style>