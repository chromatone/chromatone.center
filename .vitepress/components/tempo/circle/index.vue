<template lang="pug">
.flex.flex-col.items-center.w-full
  .flex.flex-col
    .flex(
      v-for="loop in loops", 
      :key="loop"
    ) 
      .button(@click="loop.over--")
        la-minus
      .info {{ loop.over }} / {{ loop.under }}
      .button(@click="loop.over++")
        la-plus
      .button(@click="loops.splice(i, 1)")
        la-times
    .flex(v-if="loops.length < 2")
      .info
        input.bg-transparent.w-3rem(
          inputmode="numeric"
          pattern="[0-9]*"
          type="number", 
          v-model="add.over"
          )
        span.ml-2 /
        input.bg-transparent.w-3rem(
          inputmode="numeric"
          pattern="[0-9]*"
          type="number", 
          v-model="add.under"
          )
      .button(@click="loops.push({ ...add })")
        la-plus
  svg.w-full.p-4(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    )
    tempo-circle-loop(
      v-for="(loop,i) in loops",
      :key="loop"
      :order="i"
      :metre="loop"
      :radius="400 - i * 120"
      @del="loops.splice(i - 1, 1)"
    )
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'


const add = reactive({
  over: 4,
  under: 4,
})

const loops = useStorage('tempo-loops', [
  {
    over: 8,
    under: 8
  },
  {
    over: 4,
    under: 4
  }]);
</script>

<style scoped>
.button {
  @apply p-4 border-1 m-1 cursor-pointer shadow-md rounded text-2xl;
}
.info {
  @apply p-4 rounded m-1 border-1 text-2xl;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-400;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>