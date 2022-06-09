<script setup>
const props = defineProps({
  modelValue: {type:Number, default: 1},
  min: {type: Number, default: 0},
  max: {type: Number, default: 100},
  title: {type: String, default: 'R'},
  step: {type: Number, default: 100},
})

const emit = defineEmits(['update:modelValue'])

const val = useClamp(props.modelValue, props.min, props.max)

function dragValue(drag) {
  const diff = (drag.delta[0] - drag.delta[1]) /(props.max) * props.step
  val.value += diff
  emit('update:modelValue', val.value)
}
</script>

<template lang='pug'>
.flex-1.relative.border-1.border-current.rounded-xl.overflow-hidden.text-xs.m-1.cursor-pointer.h-16.text-center(v-drag="dragValue")
  .text-xs.mt-2.font-bold {{title}} 
  .absolute.w-full.border-current.border-t-2.left-0.text-center.bottom-0.bg-dark-50.bg-opacity-10(
  :style="{ height: modelValue*100 / (max) + '%' }"
  ) {{ modelValue.toFixed() }}
</template>