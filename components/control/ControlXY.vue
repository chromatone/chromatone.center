<script setup>
import { useGesture } from '@vueuse/gesture';
import { computed, ref, watch } from 'vue';
import { useClamp } from '@vueuse/math'

const props = defineProps({
  width: { type: Number, default: 30 },
  height: { type: Number, default: 30 },
  pad: { type: Number, default: 3 },
  title: { type: String, default: 'Filter XY Pad' },
  rangeX: { type: Array, default: () => [20, 20000] },
  rangeY: { type: Array, default: () => [0, 20] },
  stepX: { type: Number, default: 10 },
  stepY: { type: Number, default: 0.1 },
});

const x = defineModel('x', { type: Number, default: 0.5 });
const y = defineModel('y', { type: Number, default: 0.5 });

const xyPad = ref();
const active = ref(false);

const clampedX = useClamp(x.value, props.rangeX[0], props.rangeX[1]);
const clampedY = useClamp(y.value, props.rangeY[0], props.rangeY[1]);

const normalizedX = computed(() => (clampedX.value - props.rangeX[0]) / (props.rangeX[1] - props.rangeX[0]));
const normalizedY = computed(() => 1 - (clampedY.value - props.rangeY[0]) / (props.rangeY[1] - props.rangeY[0]));

const displayX = computed(() => Math.round(clampedX.value));
const displayY = computed(() => clampedY.value.toFixed(2));

const circleX = computed(() => normalizedX.value * props.width);
const circleY = computed(() => normalizedY.value * props.height);

const gestureOptions = {
  drag: { preventWindowScrollY: true },
  eventOptions: { capture: false, passive: false },
};

useGesture({
  onWheel: handleInteraction,
  onDrag: handleInteraction,
  onDragStart: () => active.value = true,
  onDragEnd: () => active.value = false,
}, {
  ...gestureOptions,
  domTarget: xyPad,
});

function handleInteraction(ev) {

  const { delta, dragging, wheeling, shiftKey, event } = ev;

  if (event) { event.preventDefault(); }

  active.value = dragging || wheeling;
  if (!active.value) return
  const diff = event.type === 'wheel' ? -8 : 2;
  let stepX = delta[0] / diff
  let stepY = -delta[1] / diff
  clampedX.value += stepX * props.stepX
  x.value = clampedX.value
  clampedY.value += stepY * props.stepY
  y.value = clampedY.value
}

</script>

<template lang="pug">
svg.m-1.touch-none(
  ref="xyPad"
  version="1.1"
  baseProfile="full"
  text-anchor="start" 
  font-size="6" 
  dominant-baseline="middle" 
  fill="currentColor"
  :viewBox="`${-pad} ${-pad} ${width + pad * 2} ${height + pad * 2}`"
  xmlns="http://www.w3.org/2000/svg"
)
  // Background
  rect(
    stroke="currentColor" fill="transparent" stroke-dasharray="0.05 1" stroke-linecap="round" stroke-width="0.5"
    :x="pad"
    :y="pad"
    :width="width"
    :height="height"
    :transform="`translate(${-pad} ${-pad})`"
    rx="3"
  )

  // Title
  text(
    :x="2"
    :y="-pad / 2"
    :font-size="pad * 1.2"
    fill="currentColor"
  ) {{ title }}

  // X and Y axes
  line(
    :x1="0"
    :y1="circleY"
    :x2="width"
    :y2="circleY"
    stroke="currentColor"
    stroke-width="0.5"
    stroke-dasharray="0.1 1" stroke-linecap="round"
  )
  line(
    :x1="circleX"
    :y1="0"
    :x2="circleX"
    :y2="height"
    stroke="currentColor"
    stroke-width="0.5"
    stroke-dasharray="0.1 1" stroke-linecap="round"
  )

  // Control point
  circle.transition(
    :cx="circleX"
    :cy="circleY"
    :r="active ? 2 : 1"
    fill="currentColor"
  )

  // Display values
  text(
    :x="1"
    :y="pad + 2"
    :font-size="pad * 1.2"
    fill="currentColor"
  ) FREQ: {{ displayX }} Hz
  text(
    :x="1"
    :y="3 * pad + 4"
    :font-size="pad * 1.2"
    fill="currentColor"
  ) Q: {{ displayY }}
</template>

<style scoped>
svg {
  user-select: none;
}
</style>