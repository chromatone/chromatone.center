<script setup>
import { useRoute, useData } from "vitepress";
import { drawingEnabled, drawingPinned } from '#/theme/components/draw/draw'
// generic state
const route = useRoute();

// sidebar
const openSideBar = ref(false);

watch(route, () => {
  openSideBar.value = false;
});


</script>

<template lang="pug">
.theme
  client-only
    cast-camera
    .bottom-0.fixed.w-full.z-3000.flex.justify-center(v-if="drawingEnabled || drawingPinned")
      draw-controls
    button.fixed.bottom-32.right-24px.text-xl.z-1000(
      @click="drawingEnabled = !drawingEnabled"
      :class="{ active: drawingEnabled }"
      v-tooltip.top="'Draw on the screen'"
      )
      carbon-pen
  shop-cart-panel
  state-dark.fixed.bottom-18.right-14px.z-1000
  nav-scroll.fixed.bottom-8.right-24px.z-1000
  nav-bar(@toggle="openSideBar = !openSideBar")
  .main
    client-only
      draw-layer.z-20
    side-bar(:open="openSideBar" @close="openSideBar = false")
    home(v-if="$frontmatter.template == 'home'")
    page-primary(v-else)
//debug
</template>

<style lang="postcss">
.main {
  @apply relative flex min-h-screen bg-cover bg-center bg-fixed;
}

.sidebar-mask {
  transition: all 300ms ease-out;
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  @apply bg-gray-800 bg-opacity-60;
}
</style>

mdi-checkbox-blank-circle-outline mdi-checkbox-blank-circle
