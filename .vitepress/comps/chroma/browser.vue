<template lang="pug">
.flex.flex-col.m-auto.items-center.w-full.max-w-65ch
  .keys
    .key(
      @click="tonic = i"
      v-for="(bit,i) in '101101011010'"
      :key="i"
      :style="{ backgroundColor: i == tonic ? pitchColor(i) : bit == '1' ? 'hsla(0,0%,80%,0.4)' : 'hsla(0,0%,10%,0.4)' }"
      ) {{ notes[i].name }}
  .control-row
    .control.font-bold(:style="{ color: pitchColor(tonic) }") {{ notes[tonic].name }}
    .control(@click="control.count = !control.count") Notes 
      la-arrows-alt-v(:style="{ opacity: control.count ? 1 : 0.3 }")

    .control(@click="control.chord = !control.chord", :class="{ active: control.chord }") Chord
      la-filter.ml-2(:style="{ opacity: control.chord ? 1 : 0.3 }")

    .control(@click="control.scale = !control.scale") Scale
      la-filter.ml-2(:style="{ opacity: control.scale ? 1 : 0.3 }")

  transition-group(name="list")
    chroma-row(
      v-for="(set) in sorted",
      :key="set.chroma",
      :set="set",
      :tonic="tonic",
      )
</template>

<script setup>
import { computed } from 'vue'
import { Pcset, ChordType, ScaleType } from '@tonaljs/tonal'
import { useStorage } from '@vueuse/core'
import { pitchColor, notes } from 'chromatone-theory'


const tonic = useStorage('chroma-tonic', 0)
const search = useStorage('chroma-browser-search', '')
const control = useStorage('chroma-browser-filter', {
  scale: false,
  chord: true,
  count: true,
  num: true,
  chroma: false,
})



ChordType.add('100000000000', ['.P1/P8'], 'perfect unison/octave');
ChordType.add('110000000000', ['.m2'], 'minor second');
ChordType.add('101000000000', ['.M2'], 'major second');
ChordType.add('100100000000', ['.m3'], 'minor third');
ChordType.add('100010000000', ['.M3'], 'major third');
ChordType.add('100001000000', ['.P4'], 'perfect fourth');
ChordType.add('100000100000', ['.TT'], 'tritone');
ChordType.add('100000010000', ['.P5'], 'perfect fifth');
ChordType.add('100000001000', ['.m6'], 'minor sixth');
ChordType.add('100000000100', ['.M6'], 'major sixth');
ChordType.add('100000000010', ['.m7'], 'minor seventh');
ChordType.add('100000000001', ['.M7'], 'major seventh');

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
  @apply transition-all duration-300 p-2 m-1 sm:(p-3 m-1) rounded-lg cursor-pointer shadow-md;
  flex: 1 1 1em;
}

.key:hover {
  @apply shadow-lg;
}
</style>