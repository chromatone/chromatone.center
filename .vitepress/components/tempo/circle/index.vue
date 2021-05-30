<template lang="pug">
.flex.flex-col.items-center.w-full
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
      :metre="loop.metre"
      :radius="400 - i * 120"
      @del="loops.splice(i, 1)"
    )
  .flex.flex-col
    .flex(
      v-for="loop in loops", 
      :key="loop.metre"
    ) 
      .button(@click="loop.metre.over--")
        la-minus
      .info {{ loop.metre.over }} / {{ loop.metre.under }}
      .button(@click="loop.metre.over++")
        la-plus
      .button(@click="loops.splice(i, 1)")
        la-times
    .flex(v-if="loops.length < 2")
      .info
        input.bg-transparent.w-3rem(
          inputmode="numeric"
          pattern="[0-9]*"
          type="number", 
          v-model="add.metre.over"
          )
        span.ml-2 /
        input.bg-transparent.w-3rem(
          inputmode="numeric"
          pattern="[0-9]*"
          type="number", 
          v-model="add.metre.under"
          )
      .button(@click="loops.push({ metre: { ...add.metre } })")
        la-plus

</template>

<script setup>
import { reactive, computed } from 'vue'

const add = reactive({
  metre: {
    over: 4,
    under: 4,
  }
})

const loops = reactive([
  {
    metre: {
      over: 8,
      under: 8
    }
  },
  {
    metre: {
      over: 4,
      under: 4
    }
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