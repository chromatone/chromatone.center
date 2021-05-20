<template lang="pug">
.flex.flex-col.m-auto.items-center.w-full.max-w-65ch
  .control-row
    .control(@click="control.count = !control.count") Note count
      la-arrows-alt-v(:style="{ opacity: control.count ? 1 : 0.3 }")

    .control(@click="control.chord = !control.chord") Chord
      la-filter.ml-2(:style="{ opacity: control.chord ? 1 : 0.3 }")

    .control(@click="control.scale = !control.scale") Scale
      la-filter.ml-2(:style="{ opacity: control.scale ? 1 : 0.3 }")

  transition-group(name="list")
    pcset-row(v-for="(set,n) in sorted",:key="set.chroma", :set="set")
</template>

<script setup>
import { computed } from 'vue'
import { Pcset, ChordType, ScaleType } from '@tonaljs/tonal'
import { useStorage } from '@vueuse/core'

const search = useStorage('pcset-browser-search', '')
const control = useStorage('pcset-browser-filter', {
  scale: false,
  chord: false,
  count: true,
  num: true,
  chroma: false,
})

ChordType.add('110000000000', ['m2'], 'minor second');
ChordType.add('101000000000', ['M2'], 'major second');
ChordType.add('100100000000', ['m3'], 'major third');

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

  arr = arr.sort((a, b) => {
    if (control.value.count) {
      return a?.intervals.length < b?.intervals.length ? -1 : 1
    }
    return a?.setNum < b?.setNum ? -1 : 1
  })


  return arr
});

</script>

<style scoped>
.control-row {
  @apply p-4 flex flex-wrap;
}

.control {
  @apply m-2 p-4 bg-light-400 rounded dark:bg-dark-400 cursor-pointer;
}
</style>