<script setup>
import { computed, reactive } from 'vue'
import { useStorage } from '@vueuse/core'
import { useData } from 'vitepress'
import { Chord, Note } from 'tonal'

import { rotateArray } from '#/use/calculations'
import { chromaColorMix, noteColor } from '#/use/colors'
import { playChroma, playChromaOnce, stopChroma } from '#/use/chroma'
import { globalScale } from '#/use/global'
import { notes } from '#/use/theory'

import ukulele from '#/db/tabs/ukulele.yaml'
import guitar from '#/db/tabs/guitar.yaml'
import { playNoteOnce } from '#/use'

const { isDark } = useData()

const instruments = { ukulele, guitar }

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
    return {}
  }),
  chords: computed(() => {
    return state.instrument?.suffixes.map(suffix => {
      return {
        ...Chord.get(state.key + suffix),
        suffix,
      }
    })
  }),
  allChords: computed(() => {
    const ch = rotateArray(notes, globalScale.tonic).map(note => {
      const list = state.instrument?.suffixes
        .map(suffix => {
          return {
            ...Chord.get(note + suffix),
            suffix,
          }
        })
        .filter(chord => !chord.empty)
        .filter(chord => {
          return chord.notes.reduce((prev, next) => prev && globalScale
            .isIn(next), true)
        })
      return list
    }).filter(list => list.length > 0)
    return ch
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
.flex.flex-wrap.items-start.p-2.gap-2
  .flex-1.flex.flex-wrap.gap-2.overflow-y-scroll.overscroll-none.max-h-95svh(
    style="flex: 1 0 140px;"
    )
    control-scale.sticky.top-0.z-6.w-full

    .flex.flex-wrap.gap-1.p-2(
      style="flex: 1 1 300px;"
      )
      template(v-for="(note, n) in state.allChords" :key="n")
        .flex-1.px-1.inline-flex.flex-wrap.items-center.gap-1.rounded-lg.p-1(
          :style="{ backgroundColor: noteColor(notes.findIndex(el => el == note[0].tonic), 1) }"
          )
          .text-lg.font-bold.p-1.rounded.text-white(
            ) {{ n + 1 }}:&nbsp;{{ note[0]?.tonic }}

        button.flex-1.text-black.dark-text-light-200.px-1.bg-light-200.bg-opacity-80.dark-bg-dark-200.dark-bg-opacity-40(
          style="margin:0"
          :style="{ backgroundColor: chromaColorMix(chord.chroma, notes.findIndex(v => v == chord.tonic), 0.5, isDark ? 2 : 8).lch }"
          v-for="(chord, ch) in note" :key="chord.setNum"
          @pointerdown="playChroma(chord.chroma, notes.findIndex(v => v == chord.tonic)); state.suffix = chord.suffix; state.pitch = notes.findIndex(el => el == note[0].tonic)"
          @pointerup="stopChroma(chord.chroma, notes.findIndex(v => v == chord.tonic));"
          @pointerleave="stopChroma(chord.chroma, notes.findIndex(v => v == chord.tonic));"
          @pointercancel="stopChroma(chord.chroma, notes.findIndex(v => v == chord.tonic));"

          :class="{ active: state.suffix == chord.suffix && state.pitch == notes.findIndex(el => el == note[0].tonic) }"
          ) {{ chord.symbol || chord.suffix }}



  .is-group.flex.flex-col.items-center.overflow-y-scroll.overscroll-none.max-h-95svh(
    style="flex: 1 1 200px;"
    )
    .flex.flex.bg-light-300.rounded-md.dark-bg-dark-300.sticky.top-0.z-5.dark-bg-dark-200.w-full
      button.p-1.capitalize(
        v-for="(ins, name) in instruments" 
        :key="name"
        :class="{ active: state.instrument.main.name == name }"
        @click="current = name"
        ) {{ name }}

      .p-2.font-bold.my-2 {{ state.key }} {{ state.suffix }}
    .flex.flex-wrap.justify-center.w-full
      .tab(
        v-for="(pos, n) in state.tabs?.positions" 
        :key="pos" )
        chord-tabs-tab( 
          style="flex: 1 1 40px"
          :id="state.key + state.suffix + n"
          :name="state.key + state.suffix"
          :pitch="state.pitch"
          v-bind="pos"
          )

  .is-group.flex.flex-col.p-2(style="flex: 1 1 40px;")
    chord-tabs-neck.my-8.h-80svh(
      :instrument="current"
      @note="playNoteOnce($event)"
      :chord-notes="Chord.get(state.key + state.suffix).notes"
      )

      //- @note="state.pitch = (Note.midi($event) + 3) % 12"

      //- save-svg(:svg="pos.frets.join('')" :file="state.tabs?.key + state.tabs?.suffix + n")
</template>



<style lang="postcss" scoped>
button {
  @apply shadow m-1 rounded border-1 border-transparent transition-all duration-200 opacity-70;
}

button.active {
  @apply opacity-100 filter brightness-200;
}

button:hover {
  @apply opacity-90;
}

button.note {
  @apply text-white p-1 w-8 font-bold text-sm opacity-50 border-2 rounded-lg;


}

button.note.active {
  @apply transform scale-125;
}

.isin {
  @apply font-bold;
}

.tab {
  @apply relative flex justify-center select-none;
  flex: 1 1 100px;
}
</style>