<template lang="pug">
.flex.flex-col.m-auto.items-center.w-full.max-w-65ch
  .keys
    .key(
      @click="globalScale.tonic = i"
      v-for="(bit,i) in '101101011010'"
      :key="i"
      :style="{ backgroundColor: i == globalScale.tonic ? pitchColor(i) : bit == '1' ? 'hsla(0,0%,80%,0.4)' : 'hsla(0,0%,10%,0.4)' }"
      ) {{ notes[i].name }}
  .control-row
    .control(@click="control.count = !control.count") Notes 
      la-arrows-alt-v(:style="{ opacity: control.count ? 1 : 0.3 }")

    .control(@click="control.chord = !control.chord", :class="{ active: control.chord }") Chord
      la-filter.ml-2(:style="{ opacity: control.chord ? 1 : 0.3 }")

    .control(@click="control.scale = !control.scale") Scale
      la-filter.ml-2(:style="{ opacity: control.scale ? 1 : 0.3 }")

  .flex.flex-col.items-start
    transition-group(name="list")
      chroma-row.mb-6(
        :twoRow="false"
        v-for="(set) in sorted",
        :key="set.chroma",
        :chroma="set.chroma",
        :tonic="tonic",
        )
</template>

<script setup>
import { Pcset } from '@tonaljs/tonal'
import { pitchColor, notes } from 'chromatone-theory'
import { globalScale, chordType, scaleType } from '@use/theory.js'


const tonic = useStorage('chroma-tonic', 0)
const search = useStorage('chroma-browser-search', '')
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
    arr = arr.filter(e => !chordType.get(e.chroma).empty)
  }
  if (control.value.scale) {
    arr = arr.filter(e => !scaleType.get(e.chroma).empty)
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

<style   scoped>
.control-row {
  @apply p-4 flex flex-wrap;
}

.control {
  @apply m-2 p-4 rounded bg-light-400  dark:bg-dark-400 cursor-pointer;
}

.control.active {
  @apply bg-gray-400;
}

.keys {
  @apply z-8 rounded-md p-1 grid grid-cols-6 xs:(grid-cols-12) w-full sticky top-$header-height bg-light-400 bg-opacity-80  dark:(bg-dark-300 bg-opacity-80);
}

.key {
  @apply transition-all text-center duration-300 p-2 m-1 sm:(p-3 m-1) rounded-lg cursor-pointer shadow-md;
  flex: 1 1 1em;
}

.key:hover {
  @apply shadow-lg;
}
</style>