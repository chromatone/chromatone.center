<script setup>
const props = defineProps({
  list: Object,
});

</script>

<template lang="pug">
.flex.items-center.text-sm.rounded-full.py-1.px-2.bg-light-900.dark-bg-dark-800(v-if="list") 
  .flex-1 {{ list.length }}
</template>

<style lang="postcss" scoped></style>