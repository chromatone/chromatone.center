<template lang="pug">
.flex.flex-col
  .flex.flex-col.items-stretch.my-2.p-8.border-2.rounded-xl(
    :style="{ borderColor: pitchColor(globalScale.tonic, 2), backgroundColor: pitchColor(globalScale.tonic, 2, 1, 0.05) }"
    )
    .flex.flex-wrap.mx-auto.my-4
      control-choose(v-model="state.mode" :variants="{ circles: 'Circles', squares: 'Squares', bars: 'Bars' }")
    chroma-piano.w-20em.mx-auto(:chroma="'1000000000000'", names)
    .flex.flex-col.text-center.mb-2.relative
      .text-2xl.font-bold.flex.mx-auto.items-center {{ globalScale.note.name }} {{ state.current.title }}
      a.p-2.text-2xl.absolute.right-2.top-2.rounded-full.shadow-xl(:href="state.current.link" target="_blank" v-if="state.current.link")
        la-wikipedia-w
      .text-lg {{ state.current.degrees }} 
    transition(name="fade" mode="out-in")
      .flex.flex-wrap(:key="state.current")
        .flex-1.flex.flex-col.items-stretch.select-none(v-for="(chord,c) in getChords(state.current.degrees)" :key="chord")
          chroma-circle.min-w-8em(
            :chroma="chord.chroma" 
            :pitch="chord.tonicPitch" 
            v-if="state.mode == 'circles'"
            :type="state.current.degrees.split('-')[c]"
            )
          chroma-square.self-center.my-4.min-w-8em(
            v-if="state.mode == 'squares'"
            :chroma="chord.chroma" 
            :pitch="chord.tonicPitch" 
            :roman="state.current.degrees.split('-')[c]"
            )
          chroma-stack.mt-4(
            v-if="state.mode == 'bars'"
            :chroma="chord.chroma" 
            :pitch="chord.tonicPitch" 
            :roman="state.current.degrees.split('-')[c]"
          )
  .flex.flex-wrap.justify-center.p-4
    button.text-button.flex.flex-col(
      v-for="(progression,name) in list" :key="progression"
      @click="state.selected = name"
      :class="{ active: progression == state.current }"
    ) 
      .font-bold.px-1.mb-1 {{ progression.degrees }}
      .text-sm {{ progression.title }} 
</template>

<script setup>
const props = defineProps({
  list: {
    type: Object,
    required: true
  },
  initial: {
    type: String,
    default: 'major'
  }
});

const state = reactive({
  mode: useStorage('progresions-mode', 'bars'),
  selected: props.initial,
  current: computed(() => props.list[state.selected])
})


import { pitchColor, rotateArray, notes } from 'chromatone-theory'
import { globalScale, noteNames, playChroma, stopChroma } from '@use/theory'
import { Progression, Chord } from "@tonaljs/tonal";

function getChords(degrees) {
  let parsed = degrees.split('-');
  let names = Progression.fromRomanNumerals(globalScale.note, parsed);
  let chords = names.map(chord => {
    let info = Chord.get(chord)
    info.pitches = info.notes.map(name => noteNames[name])
    info.tonicPitch = noteNames[info.tonic]
    return info
  })
  return chords
}

</script>

<style scoped>
</style>