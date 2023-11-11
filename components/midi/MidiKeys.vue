<script setup>

</script>

<template lang='pug'>
.flex.items-center.w-full
  .flex.octave.w-full(v-for="(oct,o) in 10" :key="oct")
    .key.white.bg-light-100.rounded-full.h-8.w-8.flex-1(
      v-for="(white,w) in 7" :key="white"
      ) 
</template>