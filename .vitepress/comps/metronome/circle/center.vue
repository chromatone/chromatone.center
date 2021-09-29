<template lang="pug">
g.center
  g.bpm(
    style="touch-action:none"
  )
    circle.transition-all.duration-100.ease-out(
      stroke-width="2"
      :stroke="tempo.blink ? tempo.color : 'transparent'"
      cx="0"
      cy="0"
      r="50"
      :fill="fill"
    )
    text.bpm(
      fill="currentColor"
      font-family="Commissioner, sans-serif"
      font-weight="bold"
      font-size="42px"
      :x="0",
      :y="12",
      ) {{ tempo.bpm.toFixed() }}
  g.controls.cursor-pointer(
    font-size="30"
  )
    g.arc.plus(
      @click="tempo.bpm = Math.round(tempo.bpm + 1)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="45"
        :to="135"
        :fill="fill"
        :radius="100"
        :thickness="50"
      )
      la-plus(
        x="55"
        y="-15"
      )
    g.arc.minus(
      @click="tempo.bpm = Math.round(tempo.bpm - 1)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="225"
        :to="315"
        :fill="fill"
        :radius="100"
        :thickness="50"
      )
      la-minus(
        x="-92"
        y="-15"
      )
    g.arc.multiply(
      @click="tempo.bpm = Math.round(tempo.bpm * 2)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="315"
        :to="45"
        :fill="fill"
        :radius="100"
        :thickness="50"
      )
      la-times(
        x="-18"
        y="-94"
      )
    g.arc.multiply(
      @click="tempo.bpm = Math.round(tempo.bpm / 2)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="135"
        :to="225"
        :fill="fill"
        :radius="100"
        :thickness="50"
      )
      la-slash(
        x="-18"
        y="55"
      )
</template>

<script setup>
import { tempo } from '@use/tempo'
import { isDark } from '@theme/composables/state.js'
const fill = computed(() => isDark.value ? '#333' : '#eee');
</script>

<style scoped>
.arc {
  transition: opacity 100ms ease-out;
  opacity: 0.5;
}
.arc:hover {
  opacity: 100;
}
</style>