<script setup>
import { pitchColor, rotateArray, notes } from '@theory'
import { noteNames } from '@use/theory'
import { globalScale, playChroma, stopChroma } from '@use/chroma'
import { Progression, Chord } from "@tonaljs/tonal";

const props = defineProps({
  list: { type: Object, required: true },
  initial: { type: String, default: 'major' }
});

const state = reactive({
  mode: useStorage('progresions-mode', 'bars'),
  selected: props.initial,
  current: computed(() => props.list[state.selected])
})

const variants = { ukulele: 'Ukulele', guitar: 'Guitar', piano: 'Piano', circles: 'Circles', squares: 'Squares', bars: 'Bars' }

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

<template lang="pug">
.flex.flex-col
  .flex.flex-col.items-stretch.my-2.p-8.border-2.rounded-xl(
    :style="{ borderColor: pitchColor(globalScale.tonic, 2), backgroundColor: pitchColor(globalScale.tonic, 2, 1, 0.05) }"
    )
    .flex.flex-wrap.mx-auto.my-4
      control-choose(v-model="state.mode" :variants="variants")
    chroma-keys.w-20em.mx-auto(:chroma="'1000000000000'", v-model:pitch="globalScale.tonic")
    .flex.flex-col.text-center.mb-2.relative
      .text-2xl.font-bold.flex.mx-auto.items-center {{ globalScale.note.name }} {{ state.current.title }}
      a.p-2.text-2xl.absolute.right-2.top-2.rounded-full.shadow-xl(:href="state.current.link" target="_blank" v-if="state.current.link")
        la-wikipedia-w
      .text-lg {{ state.current.degrees }} 
    transition(name="fade" mode="out-in")
      .flex.flex-wrap(:key="state.current")
        .flex-1.flex.flex-col.items-center.select-none(v-for="(chord,c) in getChords(state.current.degrees)" :key="c")
          chroma-keys.flex-1.p-1.min-w-150px(
            :chroma="chord.chroma"
            :pitch="chord.tonicPitch"
            :roman="state.current.degrees.split('-')[c]"
            v-if="state.mode == 'piano'"
            )
          chroma-tab.max-w-10em(
            instrument="ukulele"
            :chroma="chord.chroma"
            :pitch="chord.tonicPitch"
            v-if="state.mode == 'ukulele'"
            )
          chroma-tab.max-w-10em(
            instrument="guitar"
            :chroma="chord.chroma"
            :pitch="chord.tonicPitch"
            v-if="state.mode == 'guitar'"
            )
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
          chroma-stack.mx-8(
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
      .font-bold.px-1.mb-1 {{ progression.title }}
      .text-sm {{ progression.degrees }} 
</template>
