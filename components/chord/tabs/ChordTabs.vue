<script setup>
import { rotateArray } from '#/use/calculations'
import { chromaColorMix, noteColor } from '#/use/colors'
import { globalScale, playChroma, playChromaOnce, stopChroma } from '#/use/chroma'
import ukulele from '#/db/tabs/ukulele.yaml'
import guitar from '#/db/tabs/guitar.yaml'
import { useStorage } from '@vueuse/core'
import { Chord, Note } from 'tonal'
import { computed, reactive } from 'vue'
import { notes } from '#/use'
import { useData } from 'vitepress'

const { isDark } = useData()

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
  .is-group.flex-1.p-2.flex.flex-wrap.gap-2(
    style="flex: 1 1 120px;"
    )
    control-scale
      .flex.flex-wrap.bg-light-300.m-2.rounded-md.dark-bg-dark-300
        button.p-2.text-xl.capitalize(
          v-for="(instrument, name) in instruments" 
          :key="name"
          :class="{ active: state.instrument.main.name == name }"
          @click="current = name"
          ) {{ name }}
    .flex.flex-wrap.gap-1(
      style="flex: 1 1 300px;"
      )
      template(v-for="(note, n) in state.allChords" :key="n")
        .px-1.inline-flex.flex-wrap.items-center.gap-1.rounded-lg.p-1(
          :style="{ backgroundColor: noteColor(notes.findIndex(el => el == note[0].tonic), 1) }"
          )
          .text-lg.font-bold.p-1.rounded.text-white(
            ) {{ n + 1 }}: {{ note[0]?.tonic }}

        button.text-black.dark-text-light-200.px-1.bg-light-200.bg-opacity-80.dark-bg-dark-200.dark-bg-opacity-40.min-w-16(
          style="margin:0"
          :style="{ backgroundColor: chromaColorMix(chord.chroma, notes.findIndex(v => v == chord.tonic), 0.3, isDark ? 2 : 8).lch }"
          v-for="(chord, ch) in note" :key="chord.setNum"
            @mousedown="playChroma(chord.chroma, notes.findIndex(v => v == chord.tonic));"
            @mouseup="stopChroma(chord.chroma, notes.findIndex(v => v == chord.tonic));"
            @mouseleave="stopChroma(chord.chroma, notes.findIndex(v => v == chord.tonic));"
            @touchstart="playChroma(chord.chroma, notes.findIndex(v => v == chord.tonic));"
            @touchend="stopChroma(chord.chroma, notes.findIndex(v => v == chord.tonic));"
            @click=" state.suffix = chord.suffix; state.pitch = notes.findIndex(el => el == note[0].tonic)"
            :class="{ active: state.suffix == chord.suffix && state.pitch == notes.findIndex(el => el == note[0].tonic) }"
          ) {{ chord.symbol || chord.suffix }}



  .is-group.flex.flex-col.items-center.overflow-y-scroll.max-h-100svh(
    style="flex: 1 1 200px;"
    )
    .p-2.text-2xl.font-bold.my-2 {{ state.key }} {{ state.suffix }} tabs
    .flex.flex-wrap.justify-center
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

  .is-group.flex.flex-col.p-2(
    style="flex: 0 1 100px;"
    )

    chord-tabs-neck.my-8.h-80svh(
      :instrument="current"
      @note="state.pitch = (Note.midi($event) + 3) % 12"
      :chord-notes="Chord.get(state.key + state.suffix).notes"
      )


      //- save-svg(:svg="pos.frets.join('')" :file="state.tabs?.key + state.tabs?.suffix + n")
</template>



<style lang="postcss" scoped>
button {
  @apply shadow m-1 rounded border-1 border-transparent transition-all duration-200 opacity-70;
}

button.active {
  @apply opacity-100 border-current font-bold;
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