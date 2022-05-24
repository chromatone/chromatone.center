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
    initial,
    delta: [x, y],
    delta,
    movement,
    dragging,
    shiftKey,
  } = event;
  console.log(offset)
  state.active = dragging;
  let diff = shiftKey ? 12 : 4;

  state.internal += (movement[1] >= 0 ? -x : x) / diff
  state.internal += (movement[0] < 0 ? -y : y) / diff

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

function mapNumber(
  val,
  inputmin = 0,
  inputmax = 100,
  rangemin = 0,
  rangemax = 100,
  step = 1
) {
  rangemax = parseFloat(rangemax);
  rangemin = parseFloat(rangemin);
  inputmax = parseFloat(inputmax);
  inputmin = parseFloat(inputmin);
  let result =
    ((val - inputmin) * (rangemax - rangemin)) / (inputmax - inputmin) + rangemin;
  return Math.round(result / step) * step;
}
</script>

<template lang="pug">
.knob(
  v-drag="handler"
  @dblclick="reset()"
  :drag-options="{ preventWindowScrollY: true }"
)
  .level.pointer-events-none(
    :style="{ height: state.internal + '%' }"
  )
  .p-1.pointer-events-none
    .text-lg.font-bold {{ modelValue.toFixed(fixed) }}{{ unit }}
    .text-sm {{ param.toUpperCase() }}
</template>

<style lang="postcss" scoped>
.knob {
  @apply shadow-md border-2 rounded-lg text-center border-dark-100/50 dark_(border-light-100/50) cursor-pointer select-none relative overflow-hidden;
  touch-action: none;
}

.level {
  @apply border-t-1 bg-dark-50/40 border-dark-100 dark_(border-light-100 bg-light-100/40) absolute bottom-0 w-full;
}
</style>
