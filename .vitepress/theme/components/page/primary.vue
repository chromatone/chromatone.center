<script setup>
import { useRoute } from 'vitepress'
import { drawingEnabled, drawingPinned } from '#/theme/components/draw/draw'
const route = useRoute()
</script>

<template lang="pug">
main#content
  client-only
    draw-layer.z-20
    cast-camera
    .bottom-0.fixed.w-full.z-3000.flex.justify-center(v-if="drawingEnabled || drawingPinned")
      draw-controls
  shop-cart-panel
  full-screen.text-xl.fixed.bottom-44.right-5.z-1000
  button.fixed.bottom-32.right-5.text-xl.z-1000(
    @click="drawingEnabled = !drawingEnabled"
    :class="{ active: drawingEnabled }"
    v-tooltip.top="'Draw on the screen'"
    )
    .i-carbon-pen
  state-dark.fixed.bottom-18.right-3.z-1000
  nav-scroll.fixed.bottom-8.right-6.z-1000
  page-headline
  transition(name="fade")
    .content-container(:key="route.path")
      content.content.flex-auto.z-10
      shop-message
      row-list.mb-32.max-w-full
  nav-next-prev
  //- footer-row
</template>

<style lang="postcss" scoped>
main {
  flex: 1 1 70%;
  @apply flex flex-col;
  justify-content: stretch;
}

.content-container {
  @apply flex flex-col flex-1 items-stretch bg-light-400 dark-bg-dark-400;
}
</style>
