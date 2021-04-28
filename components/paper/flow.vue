<template lang="pug">
.flex.flex-col
  svg
    filter#blur
      feGaussianBlur(:stdDeviation="20")
    filter#mirror
      feTile(width="50%", x="0",y="0")

  canvas(:style="{ filter: 'url(#blur)' }",ref="glsl",@click="setFigures()")
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watchEffect } from "vue";
import * as paper from 'paper'
const glsl = ref(null)
let intervalId
let layer

onMounted(() => {
  paper.setup(glsl.value)
  layer = new paper.Layer({
    name: 'circles'
  })
  setFigures()
  intervalId = setInterval(() => {
    setFigures()
  }, 4000)
});

onBeforeUnmount(() => {
  clearInterval(intervalId)
})

function setFigures() {

  let w = layer.view.bounds.width
  let h = layer.view.bounds.height
  const circles = []
  let x = Math.random() * w
  let y = Math.random() * h
  let tox = Math.random() * w
  let toy = Math.random() * h
  let rStart = Math.random() * w / 2
  let num = circles.length

  circles[num] = new paper.Shape.Circle({
    center: [x, y],
    radius: rStart,
    fillColor: {
      hue: Math.random() * 360,
      saturation: Math.random() * .6,
      brightness: Math.random() * .7 + .3,
      alpha: Math.random() * 0.5 + 0.5,
    },
    opacity: 0,
  })

  circles[num].tween(
    { opacity: 1, position: { x: tox, y: toy } },
    { duration: 10000, easing: 'easeInOutQuad', }
  ).then(() => {
    circles[num].tween(
      { opacity: 0 },
      { duration: 1000, easing: 'easeInOutQuad', }
    ).then(() => {
      circles.shift()
    })

  })
  // circles[num+1] = circles[num].clone()
  // circles[num+1].position = {
  //   x:Math.abs(x-w),
  //   y:y
  // }
  // circles[num+1].tween(
  //   {opacity: 1, radius: rFinish},
  //   { duration: 1000, easing: 'easeInOutQuad',}
  // )


}


</script>

<style lang="postcss" scoped>
canvas {
  @apply fixed w-full h-full top-0 left-0 right-0 bottom-0 -z-4;
}
</style>