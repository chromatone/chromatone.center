<script setup lang="ts">
import { useRoute, useData } from "vitepress";

import { drawingEnabled, drawingPinned } from './components/draw/draw'

import { ref, watch } from "vue";

// generic state
const route = useRoute();

// sidebar
const openSideBar = ref(false);

</script>

<template lang="pug">
.theme
  nav-bar(@toggle="openSideBar = !openSideBar")
  nav-view
  .main
    side-bar(:open="openSideBar" @close="openSideBar = false")
    home(v-if="$frontmatter.template == 'home'")
    page-primary(v-else)
    client-only
      draw-layer.z-100
      cast-camera
      draw-controls.fixed.bottom-4.left-4.right-16.z-100(v-if="drawingEnabled || drawingPinned")
//debug
</template>

<style lang="postcss">
.main {
  @apply relative flex items-stretch min-h-screen bg-cover bg-center bg-fixed;
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

.i-mdi-checkbox-blank-circle-outline .i-mdi-checkbox-blank-circle
