<script setup>
import { isDark } from '#/theme/composables/state.js'
const props = defineProps({
  pan: { type: Number, default: 0.75 },
  order: { type: Number, default: 0 }
})
const emit = defineEmits(['update:pan'])
function dragPan(drag) {
  emit('update:pan', props.pan + drag.delta[0] / 100)
}

</script>

<template lang="pug">
g.pan(
  style="cursor:pointer;color:currentColor"
  font-size="32px"
  v-drag="dragPan"
  @dblclick="pan != 0 ? $emit('update:pan', 0) : order == 0 ? $emit('pan', 0.5) : $emit('update:pan', -0.5)"
  )
  rect(
    x="-60"
    y="-30"
    width="120"
    height="60"
    rx="20"
    fill="transparent"
  )
  line(
    x1="-50"
    x2="50"
    :stroke="isDark ? '#555' : '#fefefe'"
    stroke-width="12"
    stroke-linecap="round"
  )
  circle(
    r="4"
    fill="currentColor"
  )
  g.dragger.transition-all.duration-100.opacity-80(
    :transform="`translate(${pan * 50},0)`"

  )
    circle(
      :r="24"
      :cx="0"
      :cy="0"
      :fill="isDark ? '#222' : '#f9f9f9'"
    )
    i-mdi-pan-horizontal(
      :x="-20"
      :y="-20"
    )
</template>

<style lang="postcss" scoped>

</style>