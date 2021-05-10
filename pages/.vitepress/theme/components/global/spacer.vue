<template lang="pug">
hr(:style="{ minHeight: height + 'px' }")
</template>

<script setup>

const props = defineProps({
  height: {
    type: Number,
    default: '120',
  }
});

</script>

<style  scoped>
</style>