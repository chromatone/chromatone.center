<template lang="pug">
.flex.flex-col.items-center.w-full
  //- .flex.flex-wrap.p-8.max-w-65ch.absolute
  //-   .info(
  //-     :class="{ active: step == current, measure: (step - 1) % measure == 0 }",
  //-     v-for="step in steps", 
  //-     :key="step"
  //-     ) 
  svg.w-full.p-4.mt-8(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    )
    tempo-circle-loop(
      v-for="loop in loops",
      :key="loop"
    )
</template>

<script setup>
import { reactive } from 'vue'


const loops = reactive(['4n', '8n']);
</script>

<style scoped>
.info {
  @apply p-2 rounded-full m-1 border-1 border-current text-2xl;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-400;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>