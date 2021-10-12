<template lang="pug">
.flex.flex-col
  .flex.flex-wrap.my-4.items-center.justify-center
    chroma-piano(
      chroma="100000000000"
    )
    .scales
      .p-2.flex-1.cursor-pointer.whitespace-nowrap(
        v-for="sc in scales"
        :key="sc.handle"
        @click="scale = sc"
        :style="{ fontWeight: scale.handle == sc.handle ? 'bold' : 'normal' }"
        ) {{ sc.name }}
    full-screen(:el="screen")
  .fullscreen-container(ref="screen")
    tonal-array(:tonic="globalScale.tonic", :scale="scale")    
</template>

<script setup>
import { useStorage } from '@vueuse/core'
import { pitchColor, pitchFreq, notes, scales } from 'chromatone-theory'
import { globalScale } from '@use/theory.js'
const scale = useStorage('array-scale', scales.minor);

const screen = ref();
</script>

<style scoped>
.keys {
  @apply h-16 mx-2 flex-1 mx-auto;
  flex: 1 1 200px;
}

.scales {
  @apply flex w-20em overflow-x-scroll m-4 p-2 my-4;
  flex: 1 1 300px;
}
</style>