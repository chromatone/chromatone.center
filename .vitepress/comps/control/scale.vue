<template lang="pug">
.flex.flex-wrap.justify-center.min-h-5rem.items-stretch
  chroma-keys.w-300px(v-model:pitch="globalScale.tonic" :chroma="globalScale.set.chroma" :title="false")
  .w-3rem.m-2.p-2.flex.items-center.font-bold.justify-center.rounded-md.text-white(:style="{ backgroundColor: pitchColor(globalScale.tonic) }") {{ globalScale.note.name }}
  select.m-2(v-model="globalScale.chroma")
    option(v-for="scale in scaleList.sort((a, b) => a.name > b.name ? 1 : -1)" :key="scale.chroma" :value="scale.chroma") {{ scale.name }}
</template>

<script setup>
import { scaleList } from '@use/theory'
import { globalScale } from '@use/chroma'
import { pitchColor } from '@theory'
</script>

<style scoped>
select {
  @apply p-2 bg-light-100 dark:bg-dark-300;
}
</style>