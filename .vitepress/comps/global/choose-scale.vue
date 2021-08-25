<template lang="pug">
.flex.flex-wrap.justify-center.min-h-5rem.items-stretch
  piano-keys(v-model:pitch="globalScale.tonic" :chroma="globalScale.set.chroma")
  .w-3rem.m-2.p-2.flex.items-center.font-bold.justify-center.rounded-md.text-white(:style="{ backgroundColor: pitchColor(globalScale.tonic) }") {{ globalScale.note.name }}
  select.m-2(v-model="globalScale.setNum")
    option(v-for="scale in scaleList.sort((a, b) => a.name > b.name ? 1 : -1)" :key="scale.setNum" :value="scale.setNum") {{ scale.name }}
</template>

<script setup>
import { globalScale, scaleList } from '@use/theory.js'
import { pitchColor } from 'chromatone-theory'
</script>

<style scoped>
select {
  @apply p-2 bg-light-100 dark:bg-dark-300;
}
</style>