<script setup>
import { loops, addLoop } from '@use/grid'
</script>

<template lang="pug">
.flex.flex-col.items-center
  state-transport
  .flex.flex-col.m-4.w-full
    transition-group(name="fade")
      pitch-bars-bar(
        v-for="(loop,l) in loops" :key="loop"
        :order="l"
        :loop="loop"
        @del="loops.splice(l, 1)"
        @over="loop.over = $event"
        @under="loop.under = $event"
        @tonic="loop.tonic = $event"
      )
    button.text-button(
      @click="addLoop()"
    )
      la-plus

</template>

<style scoped>
</style>