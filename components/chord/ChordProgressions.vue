<script setup>
import { rotateArray } from '#/use/calculations'
import { noteNames } from '#/use/theory'
import { playChroma, stopChroma } from '#/use/chroma'
import { globalScale } from '#/use/global'
import { Progression, Chord, Scale } from "tonal";
import { noteColor } from '#/use/colors'
import { reactive, computed } from 'vue'
import { useStorage } from '@vueuse/core';


const props = defineProps({
  list: { type: Object, required: true },
  initial: { type: String, default: 'major' }
});

const state = reactive({
  mode: useStorage('progresions-mode', 'bars'),
  selected: props.initial,
  current: computed(() => props.list[state.selected]),
  scaleString: computed(() => `${globalScale.note.name} ${props.list[state.selected].title}`.toLowerCase()),
  scale: computed(() => Scale.get(state.scaleString))
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
  .flex.flex-wrap.items-stretch.p-8.gap-4(
    :style="{ borderColor: noteColor(globalScale.tonic, 2), backgroundColor: noteColor(globalScale.tonic, 2, 1, 0.05) }"
    )
    chroma-keys.w-20em.mx-auto(
      :chroma="globalScale.chroma", 
      style="flex: 1 1 100px;"
      v-model:pitch="globalScale.tonic")
      .flex.flex-col.text-center.mb-2.relative.p-1()
        .text-2xl.font-bold.flex.mx-auto.items-center {{ globalScale.note.name }} {{ state.current.title }}
        a.p-1.text-2xl.absolute.right-2.top-2.rounded-full.shadow-xl(:href="state.current.link" target="_blank" v-if="state.current.link")
          .i-la-wikipedia-w
        .text-lg {{ state.current.degrees }} 
    .flex.flex-wrap.p-4.items-start(
      style="flex: 1 1 600px"
      )
      .flex.flex-wrap.my-4.w-full
        control-choose(v-model="state.mode" :variants="variants")
      button.text-button.flex.flex-col(
        v-for="(progression, name) in list" :key="progression"
        @click="state.selected = name; globalScale.chroma = state.scale.chroma"
        :class="{ active: progression == state.current }"
      ) 
        .font-bold.px-1.mb-1 {{ progression.title }}
        //- .text-sm {{ progression.degrees }} 
    transition(name="fade" mode="out-in")
      .flex.flex-wrap.gap-2.w-full(:key="state.current")
        .flex.flex-col.select-none.max-w-16rem(
          style="flex: 1 1 10rem;"
          v-for="(chord, c) in getChords(state.current.degrees)" :key="c")
          chroma-keys.flex-1.p-1.min-w-150px(
            :chroma="chord.chroma"
            :pitch="chord.tonicPitch"
            :roman="state.current.degrees.split('-')[c]"
            v-if="state.mode == 'piano'"
            :playAll="true"
            )
          chord-tab(
            :instrument="state.mode"
            :chroma="chord.chroma"
            :pitch="chord.tonicPitch"
            v-if="state.mode == 'guitar' || state.mode == 'ukulele'"
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
</template>

//TODO - voicings https://github.com/tonaljs/tonal/tree/main/packages/voicing