<template lang="pug">
.flex.flex-col.items-center.w-full.mt-8
  .flex.flex-col.items-center
    .flex.flex-wrap(
      v-for="(loop,i) in loops", 
      :key="loop"
    ) 
      .button(@click="loop.mute = !loop.mute")
        la-volume-off(v-if="loop.mute")
        la-volume-up(v-else)
      .button(@click="loop.over--")
        la-minus
      .info {{ loop.over }} / {{ loop.under }}
      .button(@click="loop.over++")
        la-plus
      .button(@click="loops.splice(i, 1)")
        la-times
    .flex(v-if="loops.length < 3")
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

  svg#metronome.w-full.p-4(
    version="1.1",
    baseProfile="full",
    viewBox="0 0 1000 1000",
    xmlns="http://www.w3.org/2000/svg",
    style="touch-action:none"
    )
    metronome-circle-loop(
      v-for="(loop,i) in loops",
      :key="loop"
      :order="i"
      :loop="loop"
      :radius="400 - i * 125"
      @del="loops.splice(i, 1)"
    )
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'


const add = reactive({
  mute: false,
  over: 4,
  under: 4,
})

const loops = useStorage('tempo-loops', [
  {
    mute: false,
    over: 8,
    under: 8
  },
  {
    mute: false,
    over: 4,
    under: 4
  }]);
</script>

<style scoped>
.button {
  @apply p-2 border-1 m-1 cursor-pointer shadow-md rounded text-2xl;
}
.info {
  @apply p-2 rounded m-1 text-2xl flex items-center;
}

.active,
.measure.active {
  @apply bg-current transition-all duration-400;
}

.measure {
  background-color: hsla(0, 0%, 50%, 0.5);
}
</style>