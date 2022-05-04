<script setup>
import SimplexNoise from 'simplex-noise';
import { useRafFn } from '@vueuse/core';

const props = defineProps({
  instrument: { type: String, default: 'inst' },
  title: { type: String, default: 'random-value' },
  minSpeed: { type: Number, default: 0.001 },
  maxSpeed: { type: Number, default: 100 },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 1 },
  coord: { type: Number, default: 1 },
});

const emit = defineEmits(['random'])

const storageTitle = computed(() => `ambient-${props.instrument}-${props.title}`)

const simplex = new SimplexNoise();

const speed = useClamp(useStorage(storageTitle.value, 50), props.minSpeed, props.maxSpeed)

const count = ref(0)
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

const random = computed(() => (simplex.noise2D(props.coord, count.value) / 2 + 0.5) * (maximum.value - minimum.value) + minimum.value)

const value = computed(() => random.value * (props.max - props.min) + props.min)

useRafFn(() => {
  count.value += speed.value / 10000
  emit('random', value.value)
})

function dragSpeed(drag) {
  const diff = drag.delta[0] / 10 - drag.delta[1] / 10
  speed.value += diff
}

function dragMin(drag) {
  const diff = drag.delta[0] / 1000 - drag.delta[1] / 1000
  minimum.value += diff
}

function dragMax(drag) {
  const diff = drag.delta[0] / 1000 - drag.delta[1] / 1000
  maximum.value += diff
}

</script>

<template lang='pug'>
.flex-1.border-1.border-current.relative.w-full.cursor-pointer.min-w-40.rounded-lg
  .flex.p-2.gap-2(v-drag="dragSpeed")
    .p-0 {{ title }}
    .flex-1.relative
      //- .absolute.p-1 Speed
      .absolute.pr-2.border-current.border-r-2.left-0.top-0.mix-blend-difference.text-right(
      :style="{ width: speed + '%' }"
      ) {{ speed.toFixed(1) }}
  .flex.relative
    .flex-1.h-6(v-drag="dragMin")
    .flex-1.h-6(v-drag="dragMax")
    .absolute.left-0.top-0.text-right.border-r-4.pr-2.pointer-events-none(:style="{ width: (value - props.min) / (props.max - props.min) * 100 + '%' }") {{ value.toFixed(2) }}
    .absolute.bg-dark-700.bg-opacity-20.border-r-2.border-current.py-2.h-full.flex.items-center(:style="{ width: minimum * 100 + '%' }" v-drag="dragMin")
      .h-2px.bg-light-100.flex-1
    .absolute.bg-light-100.bg-opacity-20.border-l-2.border-current.py-2.right-0.h-full.h-full.flex.items-center(:style="{ width: (1 - maximum) * 100 + '%' }" v-drag="dragMax")
      .h-2px.bg-light-100.flex-1
</template>