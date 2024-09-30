<script setup>
import { Pcset, ChordType, ScaleType } from 'tonal'
import { noteColor } from "#/use/colors"
import { notes } from '#/use/theory'
import { globalScale } from '#/use/global'
import { useStorage } from '@vueuse/core';
import { computed } from 'vue';
import ChromaBrowserRow from './ChromaBrowserRow.vue';
import VirtualList from 'vue3-virtual-scroll-list';


const tonic = useStorage('chroma-tonic', 0)
const control = useStorage('chroma-browser-filter', {
  scale: false,
  chord: true,
  count: true,
  num: true,
  chroma: false,
})

const allSets = Pcset.chromas().map(chroma => Pcset.get(chroma));

const filtered = computed(() => {
  let arr = allSets
  if (control.value.chord) {
    arr = arr.filter(e => !ChordType.get(e.chroma).empty)
  }
  if (control.value.scale) {
    arr = arr.filter(e => !ScaleType.get(e.chroma).empty)
  }
  return arr
});

const sorted = computed(() => {
  let arr = filtered.value
  return arr.sort((a, b) => {
    if (control.value.count) {
      return a?.intervals.length < b?.intervals.length ? -1 : 1
    }
    return a.setNum < b.setNum ? -1 : 1
  })
});

</script>

<template lang="pug">
.flex.flex-col.max-w-60ch.gap-6
  .keys
    .key(
      v-for="(bit, i) in '101101011010'"
      :key="i"
      :style="{ backgroundColor: i == globalScale.tonic ? noteColor(i) : bit == '1' ? 'hsla(0,0%,80%,0.4)' : 'hsla(0,0%,10%,0.4)' }"
      @click="globalScale.tonic = i"
      ) {{ notes[i] }}
  .control-row
    .control(@click="control.count = !control.count") Notes 
      .i-la-arrows-alt-v(:style="{ opacity: control.count ? 1 : 0.3 }")

    .control(
      :class="{ active: control.chord }", 
      @click="control.chord = !control.chord") Chord
      .i-la-filter.ml-2(:style="{ opacity: control.chord ? 1 : 0.3 }")

    .control(
      :class="{ active: control.scale }", 
      @click="control.scale = !control.scale") Scale
      .i-la-filter.ml-2(:style="{ opacity: control.scale ? 1 : 0.3 }")

  .flex.flex-col.items-start
    transition-group(name="list")
    VirtualList.w-full(
    style="height: 80vh; overflow-y: auto; overscroll: contain;"
    :data-key="'chroma'"
    :data-sources="sorted"
    :data-component="ChromaBrowserRow"
    )
      chroma-row.mb-6(
        v-for="(set) in sorted",
        :key="set.chroma",
        :two-row="false"
        :chroma="set.chroma",
        :tonic="tonic",
        )
</template>

<style lang="postcss" scoped>
.control-row {
  @apply p-2 flex flex-wrap gap-2;
}

.control {
  @apply p-2 rounded bg-light-400 dark-bg-dark-400 cursor-pointer flex items-center;
}

.control.active {
  @apply bg-gray-400;
}

.keys {
  @apply z-8 rounded-md p-2 grid grid-cols-12 sm-(grid-cols-12) w-full bg-light-400 bg-opacity-80 dark-(bg-dark-300 bg-opacity-80) gap-2;
}

.key {
  @apply transition-all text-center duration-300 p-1 rounded-lg cursor-pointer shadow-md;
  flex: 1 1 1em;
}

.key:hover {
  @apply shadow-lg;
}
</style>