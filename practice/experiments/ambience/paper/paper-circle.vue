<script setup>
import paper from "paper";
import { onMounted, watch } from "vue";

const props = defineProps({
  polar: { type: Object, default: () => { } },
  radius: { type: Number, default: 0 },
  random: { type: Number, default: 0 },
})

onMounted(() => {
  const pointer = new paper.Shape.Circle({ x: 0, y: 0 }, 5)
  const orbit = new paper.Shape.Circle({ x: + paper.view.size.width / 2, y: + paper.view.size.height / 2 }, props.radius)
  orbit.strokeWidth = 2

  watch(() => props.polar, (polar) => {
    pointer.position.x = polar.x + paper.view?.size?.width / 2
    pointer.position.y = polar.y + paper.view?.size?.width / 2
  })

  watch(() => props.radius, r => orbit.radius = r)

  watch(() => props.random, random => {
    let color = new paper.Color(random)
    pointer.fillColor = color
    orbit.strokeColor = color
    pointer.radius = 2 + 5 * (random + 1)
  })
})
</script>

<template lang="pug">
span
</template>