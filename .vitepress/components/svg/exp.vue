<template lang="pug">
.h-xl.w-full
  svg(width="100%", height="100%")
    rect.origin-center(
      :x="200",
      :y="200",
      :width="100", 
      :height="100",
      fill="green",
      v-motion,
      :hovered="{ scale: 1.6, rotate: 10 }",
      :initial="{ scale: 0.2, rotate: 0 }",
      :enter="{ scale: 1.2, rotate: 0 }",
      )
</template>

<script setup>

</script>

<style  scoped>
</style>