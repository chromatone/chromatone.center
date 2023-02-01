<script setup>
import { useTempo } from '#/use/tempo'
import { isDark } from '#/theme/composables/state'
import { reactive, computed } from 'vue'

const fill = computed(() => isDark.value ? '#333' : '#eee');

const tempo = useTempo()

const center = reactive({
  radius: 120,
  thick: 60,
});

function drag(event) {
  tempo.bpm += (event.delta[0] - event.delta[1]) / 4
}

</script>

<template lang="pug">
g.center(
  style="touch-action:none"
  text-anchor="middle",
)
  g.bpm.cursor-pointer(
    v-drag="drag"
    v-tooltip.bottom="'Drag to change BPM'"
    @dblclick="tempo.bpm = 120"
  )
    circle.transition-all.duration-100.ease-out(
      stroke-width="6"
      :stroke="tempo.blink ? tempo.color : 'transparent'"
      cx="0"
      cy="0"
      opacity="0.6"
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
      v-tooltip.right="'Add 1'"
      @mousedown="tempo.set(1)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="45"
        :to="135"
        :fill="fill"
        :op="0.7"
        :radius="center.radius"
        :thickness="center.thick"
      )
      i-la-plus(
        x="65"
        y="-15"
      )
    g.arc.minus(
      v-tooltip.left="'Subtract 1'"
      @mousedown="tempo.set(-1)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="225"
        :to="315"
        :fill="fill"
        :op="0.7"
        :radius="center.radius"
        :thickness="center.thick"
      )
      i-la-minus(
        x="-102"
        y="-15"
      )
    g.arc.multiply(
      v-tooltip.top="'Multiply by 2'"
      @mousedown="tempo.set(tempo.bpm)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="315"
        :to="405"
        :fill="fill"
        :op="0.7"
        :radius="center.radius"
        :thickness="center.thick"
      )
      i-la-times(
        x="-18"
        y="-104"
      )
    g.arc.multiply(
      v-tooltip.bottom="'Divide by 2'"
      @mousedown="tempo.set(-tempo.bpm / 2)"
    )
      svg-ring(
        :cx="0"
        :cy="0"
        :from="135"
        :to="225"
        :fill="fill"
        :op="0.7"
        :radius="center.radius"
        :thickness="center.thick"
      )
      i-la-slash(
        x="-18"
        y="65"
      )
</template>

<style lang="postcss" scoped>
.arc {
  transition: all 200ms ease-out;
  filter: brightness(100%);
}

.arc:hover {
  filter: brightness(350%);
}
</style>