<script setup>
import { useSimplex } from './simplex';
import tc from 'thousands-counter';
import { computed, watch } from 'vue';
import { useClamp } from '@vueuse/math';
import { useStorage } from '@vueuse/core';

const props = defineProps({
  instrument: { type: String, default: 'inst' },
  title: { type: String, default: 'random-value' },
  minSpeed: { type: Number, default: 0.001 },
  maxSpeed: { type: Number, default: 10000 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 1 },
  radius: { type: Number, default: 1 },
  precision: { type: Number, default: 2 },
});

const emit = defineEmits(['random'])

const storageTitle = computed(() => `ambient-${props.instrument}-${props.title}`)


const minimum = useClamp(useStorage(storageTitle.value + '-min', 0), 0, 1)
const maximum = useClamp(useStorage(storageTitle.value + '-max', 1), 0, 1)

watch([minimum, maximum], () => {
  if (minimum.value > maximum.value) {
    maximum.value = minimum.value
  }
  if (maximum.value < minimum.value) {
    minimum.value = maximum.value
  }
})

const { random, speed, radius } = useSimplex({
  title: storageTitle.value,
  size: props.radius,
})

const randomValue = computed(() => (random.value / 2 + 0.5) * (maximum.value - minimum.value) + minimum.value)

const value = computed(() => randomValue.value * (props.max - props.min) + props.min)

watch(value, v => emit('random', v))


function dragMin(drag) {
  const diff = (drag.delta[0] - drag.delta[1]) / 1000
  minimum.value += diff
}

function dragMax(drag) {
  const diff = (drag.delta[0] - drag.delta[1]) / 1000
  maximum.value += diff
}

</script>

<template lang="pug">
.flex-1.bg-light-400.dark-bg-dark-400.shadow.relative.w-full.cursor-pointer.min-w-25.rounded-lg.select-none.overflow-hidden
  .flex.flex-col.p-1.gap-0
    .px-1.pb-1 {{ title }}
    .flex.gap-2.p-1
      control-knob.flex-1(
        v-model="radius" 
        :max="250" 
        :min="10" 
        param="Radius" 
        :fixed="0")
      control-knob.flex-1(
        v-model="speed" 
        :max="maxSpeed" 
        :min="minSpeed" 
        param="Speed" 
        :step="1" 
        :fixed="0")
  .flex.relative.border-t-1.border-current
    .flex-1.h-6.cursor-pointer(
      v-drag="dragMin" 
      :drag-options="{ preventWindowScrollY: true }")
    .flex-1.h-6.cursor-pointer(
      v-drag="dragMax" 
      :drag-options="{ preventWindowScrollY: true }")
    .absolute.left-0.top-0.text-right.border-r-4.pr-2.pointer-events-none.border-current(:style="{ width: (value - props.min) / (props.max - props.min) * 100 + '%' }") {{ tc(value.toFixed(props.precision)) }}
    .absolute.bg-dark-700.bg-opacity-20.border-r-2.border-current.py-2.h-full.flex.items-center.cursor-pointer(
      v-drag="dragMin" 
      :style="{ width: minimum * 100 + '%' }")
      .h-2px.bg-dark-100.dark-bg-light-100.flex-1
    .absolute.bg-light-100.bg-opacity-20.border-l-2.border-current.py-2.right-0.h-full.h-full.flex.items-center.cursor-pointer(
      v-drag="dragMax" 
      :style="{ width: (1 - maximum) * 100 + '%' }" 
      :drag-options="{ preventWindowScrollY: true }")
      .h-2px.bg-dark-100.dark-bg-light-100.flex-1
</template>