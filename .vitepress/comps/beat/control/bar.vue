<script setup>
import { isDark } from '#theme/composables/state.js'
import { levelColor } from "#use/colors.js"

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: { type: [Number, String], default: 0.1, },
  step: { type: Number, default: 0.1, },
  min: { type: Number, default: 0, },
  max: { type: Number, default: 1, },
  width: { type: Number, default: 100, },
  height: { type: Number, default: 50, },
  vector: { type: Array, default: [1, -1], },
  showPositions: { type: Boolean, default: false, },
  ratio: { type: Number, default: 200, },
  every: { type: Number, default: null, },
  showCenter: { type: Boolean, default: false, },
  inverted: { type: Boolean, default: false, }
});

const bar = reactive({
  inner: useClamp((Number(props.modelValue) - props.min) / (props.max - props.min), 0, 1),
  proportion: computed(() => {
    if (props.inverted) {
      return (Number(props.modelValue) - props.max) / (props.min - props.max)
    } else {
      return (Number(props.modelValue) - props.min) / (props.max - props.min)
    }
  }),
  pos: computed(() => bar.proportion * props.width)
});

function dragParam(drag) {
  bar.inner += (props.vector[0] * drag.delta[0] + props.vector[1] * drag.delta[1]) / props.ratio
}

function incParam(diff) {
  bar.inner += diff * props.step / (props.max - props.min)
}

watch(() => bar.inner, val => {
  let result = val * (props.max - props.min) + props.min
  emit('update:modelValue', Math.round(result / (props.step)) * (props.step))
});

const allSteps = computed(() => {
  let total = (props.max - props.min) / props.step
  let all = []
  for (let i = 0; i <= 1; i += 1 / total) {
    all.push(i * props.width)
  }
  return all
});

</script>

<template lang="pug">
g.bar.cursor-pointer(
  v-drag="dragParam"
  font-size="32px"
  )
  line.add(
    @mousedown="incParam(1)"
    :x1="inverted ? 0 : bar.pos"
    :x2="inverted ? bar.pos : width"
    :y1="height / 2"
    :y2="height / 2"
    stroke-linecap="round"
    :stroke-width="height"
    :stroke="isDark ? '#1114' : '#fff8'"
  )
  line.pointer-events-none(
    :x1="0"
    :x2="width"
    :y1="height / 2"
    :y2="height / 2"
    stroke-linecap="round"
    :stroke-width="18"
    :stroke="isDark ? '#2228' : '#eee'"
  )
  line.subtract(
    @mousedown="incParam(-1)"
    :x1="inverted ? width : showCenter ? width / 2 : 0"
    :x2="bar.pos"
    :y1="height / 2"
    :y2="height / 2"
    stroke-linecap="round"
    :stroke-width="height"
    :stroke="isDark ? '#3338' : '#ddd8'"
  )
  g.all(
    v-if="showPositions"
  )
    circle(
      v-for="(st, s) in allSteps" :key="st"
      :cx="st"
      :cy="height / 2"
      :r="every && (s) % every == 0 ? 4 : 2"
      fill="currentColor"
      opacity="0.5"
    )
  circle(
    v-if="showCenter"
    :cx="width / 2"
    :cy="height / 2"
    r="4"
    opacity="0.5"
    fill="currentColor"
  )
  g.mover(:transform="`translate(${bar.pos} ${height / 2})`")
    circle(
      r="25"
      stroke-width="0"
      stroke-opacity="0.5"
      stroke="currentColor"
      style="filter:url(#shadowButton);"
      :fill="isDark ? '#333' : '#eee'"
    )
    g(transform="translate(0 10)" fill="currentColor" text-anchor="middle")
      slot
        text {{ modelValue }}  
</template>

<style lang="postcss" scoped>
</style>