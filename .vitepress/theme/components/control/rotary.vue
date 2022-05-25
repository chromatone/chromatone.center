<script setup>
import { midi, learnCC } from '@use/midi'

const props = defineProps({
  max: { type: Number, default: 100, },
  min: { type: Number, default: 0, },
  modelValue: { type: Number, default: 50, },
  step: { type: Number, default: 1, },
  param: { type: String, default: "param", },
  unit: { type: String, default: "", },
  fixed: { type: Number, default: 1, },
  cc: { type: Number, default: 0 },
  channel: { type: Number, default: 0 },
});



const emit = defineEmits(["update:modelValue"]);

const state = reactive({
  active: false,
  internal: 0,
  initial: 0,
  external: computed(() => {
    return mapOutput(state.internal);
  }),
});

const midiVal = learnCC({
  param: props.param,
  number: props.cc,
  channel: props.channel
})

watch(midiVal, v => {
  state.internal = v * 100;
  emit("update:modelValue", state.external);
})

function handler(event) {
  const {
    delta: [x, y],
    dragging,
    shiftKey,
  } = event;
  state.active = dragging;
  let diff = shiftKey ? 12 : 4;
  state.internal -= y / diff;
  state.internal += x / diff;
  if (state.internal > 100) state.internal = 100;
  if (state.internal < 0) state.internal = 0;
  emit("update:modelValue", state.external);
}

watchEffect(() => {
  state.internal = mapInput(props.modelValue);
});

function reset() {
  state.internal = state.initial;
  emit("update:modelValue", state.external);
}

function mapInput(val) {
  return mapNumber(val, props.min, props.max, 0, 100, props.step);
}

function mapOutput(val) {
  return mapNumber(val, 0, 100, props.min, props.max, props.step);
}

function mapNumber(val, inputmin = 0, inputmax = 100, rangemin = 0, rangemax = 100, step = 1) {
  let result = ((val - inputmin) * (rangemax - rangemin)) / (inputmax - inputmin) + rangemin;
  return Math.round(result / step) * step;
}

const r = 45
const len = Math.PI * 2 * r - 50

</script>

<template lang="pug">
.knob(
  v-drag="handler"
  @dblclick="reset()"
  :drag-options="{ preventWindowScrollY: true }"
  )
  svg(viewBox="0 0 100 120")
    g(stroke="currentColor")
      path(d="M25,90 a 45,45,1,1,1,50,0" 
      fill="none"
      stroke="#9996"
      stroke-width="8" stroke-linecap="round"
      )
      path(d="M25,90 a 45,45,1,1,1,50,0" 
      fill="none"
      stroke-width="8" stroke-linecap="round"
      :stroke-dasharray="len"
      :stroke-dashoffset="len - (len * (state.internal / 100) - 5) - 6"
      )
      g(:transform="`translate(50,52.5) rotate(${state.internal * 2.9}) `")
        circle(stroke-width="2" fill="none" :r="38" opacity="0.6")
        circle(r="4" cx="-15" cy="25" fill="currentColor" opacity="0.8")
    g(transform="translate(50,50)" text-anchor="middle" dominant-baseline="middle" fill="currentColor")
      text.font-bold.text-2xl(:transform="`translate(0,${unit ? -3 : 5})`")
        tspan(dominant-baseline="middle") {{ modelValue.toFixed(fixed) }}
      text(transform="translate(0,20)")
        tspan(dominant-baseline="middle") {{ unit }}
      text.font-bold(transform="translate(0,58)")
        tspan(dominant-baseline="middle")  {{ param.toUpperCase() }}

</template>

<style lang="postcss" scoped>
.knob {
  @apply p-1 cursor-move rounded-lg max-w-18 text-center border-dark-100/50 dark_(border-light-100/50) cursor-pointer select-none relative overflow-hidden;
  touch-action: none;
}

.level {
  @apply border-t-1 bg-dark-50/40 border-dark-100 dark_(border-light-100 bg-light-100/40) absolute bottom-0 w-full;
}
</style>
