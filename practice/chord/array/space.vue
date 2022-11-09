<script setup>
import tonalArray from './array.vue'
import { useStorage } from '@vueuse/core'
import { pitchFreq } from '#/use/calculations'
import { scales } from '#/use/theory'
import { globalScale } from '#/use/chroma'


const scale = useStorage('array-scale', scales.minor);

const screen = ref();
</script>

<template lang="pug">
.flex.flex-col
  .flex.flex-wrap.my-4.items-center.justify-center
    chroma-keys.w-250px(
      :title="false"
      chroma="100000000000"
      v-model:pitch="globalScale.tonic"
      )
    .scales
      .p-2.flex-1.cursor-pointer.whitespace-nowrap(
        v-for="sc in scales"
        :key="sc.handle"
        @click="scale = sc"
        :style="{ fontWeight: scale.handle == sc.handle ? 'bold' : 'normal' }"
        ) {{ sc.name }}
    full-screen(:el="screen")
  .fullscreen-container.rounded-4xl(ref="screen")
    tonal-array(:tonic="globalScale.tonic", :scale="scale")    
</template>

<style lang="postcss" scoped>
.keys {
  @apply h-16 mx-2 flex-1 mx-auto;
  flex: 1 1 200px;
}

.scales {
  @apply flex w-20em overflow-x-scroll m-4 p-2 my-4;
  flex: 1 1 300px;
}
</style>