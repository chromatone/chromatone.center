

<script setup>
import { getCircleCoord } from '#/use/calculations'
import { useData } from 'vitepress'
const { isDark } = useData()
import { midi } from '#/use/midi'
import { controls } from './controls';
import { ref, reactive, computed, watch } from 'vue'
import { useClamp } from '@vueuse/math';
import { useGesture } from '@vueuse/gesture';


const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: { type: Number, default: 0.1, },
  step: { type: Number, default: 0.1, },
  min: { type: Number, default: 0, },
  max: { type: Number, default: 1, },
  start: { type: Number, default: 0, },
  finish: { type: Number, default: 90, },
  radius: { type: Number, default: 300, },
  cx: { type: Number, default: 500, },
  cy: { type: Number, default: 500, },
  vector: { type: Array, default: () => [1, -1], },
  showPositions: { type: Boolean, default: false, },
  ratio: { type: Number, default: 200, },
  every: { type: Number, default: null, },
  showCenter: { type: Boolean, default: false, },
  midiChannel: { type: Number, default: 1, },
  midiCC: { type: Number, default: 0, },
});

const arc = reactive({
  inner: useClamp((props.modelValue - props.min) / (props.max - props.min), 0, 1),
  proportion: computed(() => ((props.modelValue - props.min) / (props.max - props.min))),
  angle: computed(() => arc.proportion * (props.start - props.finish) + props.finish),
  position: computed(() => getCircleCoord(arc.angle, 360, props.radius - 25, 1000)),
  center: computed(() => getCircleCoord(props.finish - (props.finish - props.start) / 2, 360, props.radius - 25, 1000))
});

const control = ref()

useGesture({
  onDrag(ev) {
    ev?.event?.preventDefault()
    arc.inner += (props.vector[0] * (ev.delta[0]) + props.vector[1] * (ev.delta[1])) / props.ratio
  },
  onWheel(ev) {
    ev?.event?.preventDefault()

    arc.inner += (props.vector[0] * (-ev.velocities[0]) + props.vector[1] * (-ev.velocities[1])) / props.ratio
  }
}, {
  domTarget: control,
  eventOptions: { passive: false }
})


function dragParam(drag) {
  arc.inner += (props.vector[0] * (drag.delta[0]) + props.vector[1] * (drag.delta[1])) / props.ratio
}

function incParam(diff) {
  arc.inner += diff * props.step / (props.max - props.min)
}

watch(() => arc.inner, val => {
  let result = val * (props.max - props.min) + props.min
  emit('update:modelValue', Math.round(result / (props.step)) * (props.step))
});

const allSteps = computed(() => {
  let total = (props.max - props.min) / props.step
  let all = []
  for (let i = 0; i <= 1; i += 1 / total) {
    let pos = getCircleCoord(i * (props.finish - props.start) + props.start, 360, props.radius - 25, 1000)
    all.push(pos)
  }
  return all
});

const prevCC = ref(0)

watch(() => midi.cc, cc => {
  if (cc.channel != controls.channel || cc.number != props.midiCC) return
  prevCC.value = cc.value
  arc.inner = cc.value
})

</script>

<template lang="pug">
g.arc.cursor-grab.active-cursor-grabbing(
  ref="control"
  )
  defs
    filter#shadowButton(
      x="-50%" 
      height="200%" 
      width="300%")
      feDropShadow(
        dx="0" 
        dy="3" 
        stdDeviation="3" 
        flood-color="#2225")
  svg-ring.increase(
    :cx="500"
    :cy="500"
    :from="props.start"
    :to="arc.angle"
    :fill="isDark ? '#1111' : '#fff4'"
    :radius="radius"
    :thickness="50"
    round
    @mousedown="incParam(1)"
    )
  svg-ring.decrease(
    :cx="500"
    :cy="500"
    :from="arc.angle"
    :to="showCenter ? (props.finish + props.start) / 2 : props.finish"
    :fill="isDark ? '#8882' : '#ddd9'"
    :radius="radius"
    :thickness="50"
    round
    @mousedown="incParam(-1)"
    )
  svg-ring.line.pointer-events-none(
    style="pointer-events:none"
    :cx="500"
    :cy="500"
    :from="props.start"
    :to="props.finish"
    :fill="isDark ? '#333' : '#cdcdcd'"
    :op="0.7"
    :radius="radius - 17"
    :thickness="16"
    round
    ) 

  circle.pointer-events-none(
    v-if="showCenter"
    opacity="0.75"
    fill="currentColor"
    r="4"
    :cx="arc.center.x"
    :cy="arc.center.y"
  )
  g.all.pointer-events-none(
    v-if="showPositions"
    )
    circle.pointer-events-none(
      v-for="(st, s) in allSteps" 
      :key="st"
      :cx="st.x"
      :cy="st.y"
      :r="every && (s) % every == 0 ? 4 : 2"
      fill="currentColor"

      opacity="0.4"
    )

  g.pointer-events-none(
    :transform="`translate(${arc.position.x} ${arc.position.y})`"
  )

    circle.pointer-events-none(
      style="filter:url(#shadowButton);"
      r="25"
      stroke-width="3"
      stroke-opacity="0.3"
      :fill="isDark ? '#333' : '#ddd'"
    )
    g(
      transform="translate(0 10)" 
      fill="currentColor")
      slot
        text {{ modelValue.toFixed(2) }}
  
</template>

<style lang="postcss" scoped></style>