<template lang="pug">
.flex.flex-wrap.my-4.items-center.justify-center
  piano-keys.keys(
    v-model:pitch="globalScale.tonic"
  )
  .scales
    .p-2.flex-1.cursor-pointer.whitespace-nowrap(
      v-for="sc in scales"
      :key="sc.handle"
      @click="scale = sc"
      :style="{ fontWeight: scale.handle == sc.handle ? 'bold' : 'normal' }"
      ) {{ sc.name }}
tonal-array(:tonic="globalScale.tonic", :scale="scale")
</template>

<script setup>
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { pitchColor, pitchFreq, notes, scales } from 'chromatone-theory'
import { globalScale } from '@use/theory.js'
const scale = ref(scales.minor);
</script>

<style scoped>
.keys {
  @apply h-16 mx-2 flex-1 mx-auto;
  flex: 1 1 200px;
}

.scales {
  @apply flex overflow-x-scroll py-2 my-4;
  flex: 1 1 300px;
}
</style>