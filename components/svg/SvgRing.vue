<script setup>

import { reactive, computed } from 'vue'

const props = defineProps({
  fill: { type: String, default: 'gray' },
  stroke: { type: String, default: 'none' },
  sWidth: { type: Number, default: 0 },
  cx: { type: Number, default: 500 },
  cy: { type: Number, default: 500 },
  radius: { type: Number, default: 450 },
  from: { type: Number, default: 0 },
  to: { type: Number, default: 360 },
  thickness: { type: Number, default: 100 },
  op: { type: Number, default: 1 },
  round: { type: Boolean, default: false, }
});


// arc
const arc = reactive({
  from: computed(() => props.from <= props.to ? props.from : props.to),
  to: computed(() => props.from > props.to ? props.from : props.to),
  start: computed(() => getPolar(arc.to)),
  end: computed(() => getPolar(arc.from)),
  largeArcFlag: computed(() => arc.to - arc.from <= 180 ? "0" : "1"),
  cutout: computed(() => props.radius - props.thickness),
  start2: computed(() => getPolar(arc.to, arc.cutout)),
  end2: computed(() => getPolar(arc.from, arc.cutout)),
})

function getPolar(angle = 0, radius = props.radius) {
  return polarToCartesian(props.cx, props.cy, radius, angle)
}

const d = computed(() => [
  "M", arc.start.x, arc.start.y,
  "A", props.radius, props.radius, 0, arc.largeArcFlag, 0, arc.end.x, arc.end.y,
  "L", arc.end2.x, arc.end2.y,
  "A", arc.cutout, arc.cutout, 0, arc.largeArcFlag, 1, arc.start2.x, arc.start2.y,
  "L", arc.start.x, arc.start.y,
  "Z",
].join(" "));

const pill = computed(() => [
  "M", arc.start.x, arc.start.y,
  "A", props.radius, props.radius, 0, arc.largeArcFlag, 0, arc.end.x, arc.end.y,
  "A", props.thickness / 2, props.thickness / 2, 0, 0, 0, arc.end2.x, arc.end2.y,
  "A", arc.cutout, arc.cutout, 0, arc.largeArcFlag, 1, arc.start2.x, arc.start2.y,
  "A", props.thickness / 2, props.thickness / 2, 0, 0, 0, arc.start.x, arc.start.y,
  "Z",
].join(" "));


function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

</script>

<template lang="pug">
g
  path(
    :d="round ? pill : d" 
    :fill="fill" 
    :stroke="stroke" 
    :stroke-width="sWidth"
    fill-rule="evenodd"
    stroke-linejoin="round"
    :fill-opacity="op"
    :transform-origin="`${cx} ${cy}`"
    )
  g(:transform="`translate(${getPolar((arc.from+arc.to)/2,radius-thickness/2).x} ${getPolar((arc.from+arc.to)/2,radius-thickness/2).y})`")
    slot
</template>

<style lang="postcss" scoped></style>