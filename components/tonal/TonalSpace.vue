<script setup>
import { globalScale } from '#/use/chroma'

</script>

<template lang="pug">
.flex.flex-col.gap-4
  #screen.fullscreen-container.rounded-3xl
    tonal-array(
      :tonic="globalScale.tonic", 
      :chroma="globalScale.chroma"
      )
  control-scale Choose a tonic note and scale
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