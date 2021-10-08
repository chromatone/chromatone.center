<template lang="pug">
path(
  style="transition: all 200ms ease-out"
  :d="d" 
  :fill="fill" 
  :stroke="stroke" 
  stroke-width="1"
  fill-rule="evenodd"
  stroke-linejoin="round"
  :fill-opacity="op"
  :transform-origin="`${cx} ${cy}`"
  )
  slot
</template>

<script setup>
const props = defineProps({
  fill: {
    type: String,
    default: 'gray'
  },
  stroke: {
    type: String,
    default: 'none'
  },
  cx: {
    type: Number,
    default: 500
  },
  cy: {
    type: Number,
    default: 500
  },
  radius: {
    type: Number,
    default: 450
  },
  from: {
    type: Number,
    default: 0
  },
  to: {
    type: Number,
    default: 360
  },
  thickness: {
    type: Number,
    default: 100
  },
  op: {
    type: Number,
    default: 1
  }
});


// arc
const arc = reactive({
  start: computed(() => polarToCartesian(props.cx, props.cy, props.radius, props.to)),
  end: computed(() => polarToCartesian(props.cx, props.cy, props.radius, props.from)),
  largeArcFlag: computed(() => props.to - props.from <= 180 ? "0" : "1"),
  cutout_radius: computed(() => props.radius - props.thickness),
  start2: computed(() => polarToCartesian(props.cx, props.cy, arc.cutout_radius, props.to)),
  end2: computed(() => polarToCartesian(props.cx, props.cy, arc.cutout_radius, props.from)),
})

const d = computed(() => [
  "M", arc.start.x, arc.start.y,
  "A", props.radius, props.radius, 0, arc.largeArcFlag, 0, arc.end.x, arc.end.y,
  "L", arc.end2.x, arc.end2.y,
  "A", arc.cutout_radius, arc.cutout_radius, 0, arc.largeArcFlag, 1, arc.start2.x, arc.start2.y,
  "L", arc.start.x, arc.start.y,
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

<style scoped>
</style>