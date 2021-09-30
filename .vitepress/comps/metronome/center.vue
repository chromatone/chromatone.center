<template lang="pug">
g.center(
  style="touch-action:none"
)
  g.bpm.cursor-pointer(

    v-drag="drag"
  )
    circle.transition-all.duration-100.ease-out(
      stroke-width="2"
      :stroke="tempo.blink ? tempo.color : 'transparent'"
      cx="0"
      cy="0"
      :r="center.radius / 2"
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
      @click="setTempo(1)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="45"
        :to="135"
        :fill="fill"
        :radius="center.radius"
        :thickness="center.thick"
      )
      la-plus(
        x="65"
        y="-15"
      )
    g.arc.minus(
      @click="setTempo(-1)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="225"
        :to="315"
        :fill="fill"
        :radius="center.radius"
        :thickness="center.thick"
      )
      la-minus(
        x="-102"
        y="-15"
      )
    g.arc.multiply(
      @click="setTempo(tempo.bpm)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="315"
        :to="45"
        :fill="fill"
        :radius="center.radius"
        :thickness="center.thick"
      )
      la-times(
        x="-18"
        y="-104"
      )
    g.arc.multiply(
      @click="setTempo(-tempo.bpm / 2)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="135"
        :to="225"
        :fill="fill"
        :radius="center.radius"
        :thickness="center.thick"
      )
      la-slash(
        x="-18"
        y="65"
      )
</template>

<script setup>
import { tempo } from '@use/tempo'
import { isDark } from '@theme/composables/state.js'
const fill = computed(() => isDark.value ? '#333' : '#eee');

const center = reactive({
  radius: 120,
  thick: 60,
});

function drag(event) {
  tempo.bpm = clampNum(tempo.bpm, event.delta[0] / 4 - event.delta[1] / 4)
}

function setTempo(diff) {
  tempo.bpm = Math.round(clampNum(tempo.bpm, diff))
}

function clampNum(main, delta, min = 10, max = 500) {
  let num = Number(main) + Number(delta)
  if (num < min) {
    num = min
  }
  if (num > max) {
    num = max
  }
  return num
}

</script>

<style scoped>
.arc {
  transition: all 200ms ease-out;
  filter: brightness(100%);
}
.arc:hover {
  filter: brightness(350%);
}
</style>