<script setup>
import { scaleList, notes } from '#/use/theory'
import { globalScale } from '#/use/chroma'
import { noteColor } from "#/use/colors"

const sortedScales = computed(() => {
  return scaleList.sort((a, b) => {
    if (a.intervals.length > b.intervals.length) {
      return 1
    } else if (a.intervals.length < b.intervals.length) {
      return -1
    } else {
      return a.name > b.name ? 1 : -1
    }
  })
})

const groupedScales = computed(() => {
  let groups = {}
  scaleList.forEach(scale => {
    let len = scale.intervals.length
    groups[len] = groups[len] || []
    groups[len].push(scale)
  })
  return groups
})
</script>

<template lang="pug">
.flex.flex-col.justify-center.min-h-5rem.items-center
  chroma-keys.w-300px(v-model:pitch="globalScale.tonic" :chroma="globalScale.set.chroma" :title="false")
    select.m-2.rounded-xl(v-model="globalScale.chroma")
      optgroup(:label="len + ' notes'" v-for="(group, len) in groupedScales" :key="group")
        option(v-for="scale in group" :key="scale.chroma" :value="scale.chroma") {{ notes[globalScale.tonic] }} {{ scale.name }}
</template>

<style lang="postcss" scoped>
select {
  @apply p-2 bg-light-100 dark-bg-dark-300;
}

optgroup[label] {
  color: grey;
  font-style: normal;
  font-weight: bold;
  text-shadow: none
}
</style>