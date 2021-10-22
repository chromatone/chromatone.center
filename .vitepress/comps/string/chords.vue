<script setup>
import { notes, rotateArray, pitchColor } from 'chromatone-theory'
import { globalScale } from '@use/theory.js'
import ukulele from '../../db/ukulele.json'
import guitar from '../../db/guitar.json'
import { useStorage } from '@vueuse/core'
import { Chord } from '@tonaljs/tonal'
const instruments = {
  ukulele, guitar
}
const current = useStorage('string-instrument', 'ukulele')
const state = reactive({
  instrument: computed(() => instruments[current.value]),
  key: computed(() => state.instrument.keys[state.pitch]),
  pitch: useStorage('chord-pitch', 3),
  suffix: useStorage('chord-suffix', ukulele.suffixes[0]),
  chordType: useStorage('chord-type', 'Triad'),
  tabs: computed(() => {
    let tabs = state.instrument.chords?.[state.key]
    if (tabs) {
      return tabs.find(tab => tab.suffix == state.suffix)
    }
  }),
  chords: computed(() => {
    return state.instrument?.suffixes.map(suffix => {
      return {
        ...Chord.get(state.key + suffix),
        suffix,
      }
    })
  }),
  byNotes: {
    'Triads': computed(() => state.chords.filter(chord => chord.notes.length == 3)),
    'Tetrads': computed(() => state.chords.filter(chord => chord.notes.length == 4)),
    'Pentads': computed(() => state.chords.filter(chord => chord.notes.length == 5)),
    'More': computed(() => state.chords.filter(chord => chord.notes.length != 3 && chord.notes.length != 4 && chord.notes.length != 5)),
  },
});

function isInScale(list) {
  if (list && list.length > 0) {
    let count = 0
    for (let i = 0; i < list.length; i++) {
      if (globalScale.isIn(list[i])) {
        count++
      }
    }
    return (count) / list.length + 0.2
  } else {
    return 0.4
  }
}

</script>


<template lang="pug">
.flex.flex-col.items-center


  .is-group.flex.flex-col.items-center.p-2
    .text-xl.font-bold.mt-2 Instrument
    .flex.flex-wrap.justify-center.my-2
      button.p-4.text-xl.capitalize(
        v-for="(instrument,name) in instruments" :key="name"
        :class="{ active: state.instrument.main.name == name }"
        @click="current = name"
        ) {{ name }}


  .is-group.flex.flex-col.items-center.p-2.my-2
    .text-xl.font-bold.mt-4 Scale
    control-scale.flex-1.mb-4
    string-neck.my-8(
      :instrument="current"
      :chordNotes="Chord.get(state.key + state.suffix).notes"
      )
  .is-group.flex.flex-col.items-center.p-2


    .text-xl.font-bold.mb-2 Chord
    .flex.flex-wrap.justify-center.my-2
      button.note(
        :style="{ backgroundColor: pitchColor(k, 3, rotateArray(globalScale.full?.chroma, -globalScale.tonic)[k] == '1' ? 1 : 0.05) }"
        :class="{ active: state.key == key }"
        v-for="(key,k) in state.instrument.keys" :key="key"
        @click="state.pitch = k"
      ) {{ key }}

    .flex.flex-wrap.border-b-1.border-current.p-2
      .p-1.text-button.cursor-pointer(
        :class="{ active: noteNum == state.chordType }"
        v-for="noteNum in Object.keys(state.byNotes)" :key="noteNum"
        @click="state.chordType = noteNum"
        ) {{ noteNum }}

    .flex.flex-wrap.justify-center.items-center.mt-4
      button.text-button(
        :style="{ opacity: isInScale(chord.notes) }"
        :class="{ active: state.suffix == chord.suffix, isin: isInScale(chord.notes) == 1.2 }"
        v-for="chord in state.byNotes[state.chordType]" :key="chord.suffix"
        @click="state.suffix = chord.suffix"
        )  {{ chord.symbol || chord.suffix }}

  .is-group.flex.flex-col.items-center.my-2
    .p-2.text-2xl.font-bold.my-2 {{ state.key }} {{ state.suffix }} tabs
    .flex.flex-wrap.justify-center
      .tab(v-for="(pos,n) in state.tabs?.positions" :key="pos" )
        string-tab( 
          :id="state.key + state.suffix + n"
          :name="state.key + state.suffix"
          :pitch="state.pitch"
          v-bind="pos"
          )
      //- svg-save(:svg="pos.frets.join('')" :file="state.tabs?.key + state.tabs?.suffix + n")
</template>



<style scoped>
button {
  @apply shadow m-1 rounded border-1 border-transparent transition-all duration-200;
  &.note {
    @apply text-white p-2 font-bold opacity-50 border-2 rounded-lg;
    &.active {
      @apply transform scale-125;
    }
  }
  &.active {
    @apply opacity-100 border-current;
  }
  &:hover {
    @apply opacity-90;
  }
}
.isin {
  @apply font-bold;
}
.tab {
  @apply relative flex justify-center;
  flex: 1 1 100px;
}
</style>