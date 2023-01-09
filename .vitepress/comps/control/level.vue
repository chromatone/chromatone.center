<script setup>
const props = defineProps({
  meter: Number
})
</script>

<template lang="pug">
.rounded-xl.overflow-hidden.w-4.relative.my-1.bg-light-800.dark-bg-dark-800
  .absolute.bottom-0.left-0.w-full.transition-all.duration-50ms(:style="{ height: meter * 100 + '%', backgroundColor: `hsl(${180 - meter * 180},90%,50%)` }")
</template>