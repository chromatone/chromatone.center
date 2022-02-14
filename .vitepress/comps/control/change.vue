<script setup>
const props = defineProps({
  max: {
    type: Number,
    default: 100
  },
  min: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Number,
    default: 50,
  },
  step: {
    type: Number,
    default: 1
  },
  param: {
    type: String,
    default: 'param',
  },
  unit: {
    type: String,
    default: ''
  },
  fixed: {
    type: Number,
    default: 0,
  },
  ratio: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['update:modelValue'])

const state = reactive({
  active: false,
  internal: 0,
  initial: 0,
  external: computed(() => {
    return mapOutput(state.internal)
  })
})

function handler(event) {
  const { delta: [x, y], dragging, shiftKey } = event
  state.active = dragging
  let diff = props.ratio
  state.internal -= y / diff
  state.internal += x / diff
  if (state.internal > 100) state.internal = 100
  if (state.internal < 0) state.internal = 0
  emit('update:modelValue', state.external)
}

function change(val = 1) {
  let diff = props.step / (props.max - props.min)
  state.internal += 100 * diff * val
  if (state.internal > 100) state.internal = 100
  if (state.internal < 0) state.internal = 0
  emit('update:modelValue', state.external)
}

watchEffect(() => {
  state.internal = mapInput(props.modelValue)
})

function reset() {
  state.internal = state.initial
  emit('update:modelValue', state.external)
}

function mapInput(val) {
  return mapNumber(val, props.min, props.max, 0, 100, props.step)
}

function mapOutput(val) {
  return mapNumber(val, 0, 100, props.min, props.max, props.step)
}

function mapNumber(
  val,
  inputmin = 0,
  inputmax = 100,
  rangemin = 0,
  rangemax = 100,
  step = 1,
) {
  rangemax = parseFloat(rangemax)
  rangemin = parseFloat(rangemin)
  inputmax = parseFloat(inputmax)
  inputmin = parseFloat(inputmin)
  let result =
    ((val - inputmin) * (rangemax - rangemin)) / (inputmax - inputmin) +
    rangemin
  return Math.round(result / (step)) * (step)
}

</script>

<template lang="pug">
.knob(
  v-drag="handler"
  :drag-options="{ preventWindowScrollY: true }"
)
  .level(
    :style="{ width: state.internal + '%' }"
  )
  .flex.items-center
    .pl-1.absolute(@mousedown="change(-1)")
      la-minus
    .px-1.flex-1.text-center(@dblclick="reset()" )
      slot
        .text-lg.font-bold {{ modelValue.toFixed(fixed) }}{{ unit }}
    .pr-1.absolute.right-0(@mousedown="change(1)")
      la-plus
</template>

<style scoped>
.knob {
  @apply shadow-md m-1 border-2 rounded-lg text-center border-dark-100/50 dark_(border-light-100/50) cursor-pointer select-none relative overflow-hidden flex flex-col justify-center;
  touch-action: none;
}

.level {
  @apply border-r-2 bg-dark-50/20 border-dark-100/60  dark_(border-light-100/60 bg-light-100/40) absolute top-0 bottom-0 w-full;
}
</style>