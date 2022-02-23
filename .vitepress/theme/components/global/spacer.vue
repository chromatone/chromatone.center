<script setup>

const props = defineProps({
  height: {
    type: Number,
    default: '120',
  }
});

</script>

<template lang="pug">
hr(:style="{ minHeight: height + 'px' }")
</template>

<style  scoped>
</style>