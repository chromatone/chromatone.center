<template lang="pug">
.flex.items-center.mx-2.text-sm.rounded-full.py-1.px-2(class="text-$c-brand bg-$c-bg-secondary",v-if="list") 
  .flex-1 {{list.length}}
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  list: Object,
});

</script>

<style  scoped>
</style>