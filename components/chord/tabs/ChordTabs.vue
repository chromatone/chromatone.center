<script setup>
import { rotateArray } from '#/use/calculations'
import { noteColor } from '#/use/colors'
import { globalScale } from '#/use/chroma'
import ukulele from '#/db/ukulele.yaml'
import guitar from '#/db/guitar.yaml'
import { useStorage } from '@vueuse/core'
import { Chord, Note } from '@tonaljs/tonal'
import { computed, reactive } from 'vue'
import { notes } from '#/use'

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


.is-group.flex.flex-col.items-stretch.p-2

  .flex.flex-wrap.max-w-100
    control-scale.flex-1.mb-4

  .is-group.flex.flex-col.p-2.my-2
    .flex.flex-wrap.my-2
      button.p-4.text-xl.capitalize(
        v-for="(instrument, name) in instruments" 
        :key="name"
        :class="{ active: state.instrument.main.name == name }"
        @click="current = name"
        ) {{ name }}
    chord-tabs-neck.my-8(
      :instrument="current"
      @note="state.pitch = (Note.midi($event) + 3) % 12"
      :chord-notes="Chord.get(state.key + state.suffix).notes"
      )
  .flex.max-h-90svh
    .is-group.flex.flex-col.items-center.my-2.overflow-y-scroll(
      style="flex: 3 1 65%;"
    )
      .p-2.text-2xl.font-bold.my-2 {{ state.key }} {{ state.suffix }} tabs
      .flex.flex-wrap.justify-center
        .tab(
          v-for="(pos, n) in state.tabs?.positions" 
        :key="pos" )
          chord-tabs-tab( 
            :id="state.key + state.suffix + n"
            :name="state.key + state.suffix"
            :pitch="state.pitch"
            v-bind="pos"
            )
    .is-group.flex-1.p-2.flex.flex-col.gap-2.overflow-y-scroll(
      style="flex: 1 1 35%;"
    )


      .px-1.inline-flex.flex-wrap.items-center.gap-1.rounded-lg.p-1(
        v-for="(note,n) in state.allChords" :key="n"
        :style="{backgroundColor:noteColor(notes.findIndex(el=>el == note[0].tonic),1)}"
        )
        .text-lg.font-bold.p-1.rounded(
          ) {{ n+1 }}: {{ note[0]?.tonic }}

        button.text-black.dark-text-light-200.px-1.bg-light-200.bg-opacity-80.dark-bg-dark-200.dark-bg-opacity-40(
          style="margin:0"
          v-for="(chord,ch) in note" :key="chord.setNum"
            @click="state.suffix = chord.suffix; state.pitch= notes.findIndex(el=>el == note[0].tonic)"
            :class="{active: state.suffix == chord.suffix && state.pitch== notes.findIndex(el=>el == note[0].tonic)}"
          ) {{ chord.symbol || chord.suffix }}




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