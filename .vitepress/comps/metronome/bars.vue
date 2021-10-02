<template lang="pug">
.flex.flex-col.items-center.w-full
  svg#metronome.w-full.my-8.max-h-90vh(
    version="1.1",
    baseProfile="full",
    :viewBox="`0 0 ${box.width} ${box.height}`",
    xmlns="http://www.w3.org/2000/svg",
    style="user-select:none;touch-action:none"
    )
    metronome-bars-bar(
      v-for="(bar,b) in bars" :key="bar"
      :transform="`translate(0, ${b * 200})`"
    )
</template>

<script setup>
const box = reactive({
  width: 1000,
  height: 400,
});

const bars = reactive([0, 1]);

</script>

<style scoped>
</style>