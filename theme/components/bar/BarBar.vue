<script setup>
import { useRoute, useData } from "vitepress";
import { drawingEnabled } from '../../composables/draw'
import { ref } from "vue";
import { tempo } from "#/use/tempo";
import { globalScale, noteColor, notes } from "#/use";
import { mic } from "#/use/mic";
import { midi } from "#/use/midi"

import FullScreen from '../global/FullScreen.vue'
import BarPanel from "./BarPanel.vue";

const route = useRoute()
const { theme } = useData()

const searchOpen = ref()
const practiceOpen = ref()
const theoryOpen = ref()
const settingsOpen = ref()
const transportOpen = ref()
const scaleOpen = ref()

const instrument = ref('guitar')


</script>

<template lang='pug'>
nav.bar
  a(
    href="/"
    v-tooltip.right="'Chromatone'"
    aria-label="Back to main page"
    )
    img.cursor-pointer.mt-3.mb-2.w-10(src="https://chromatone.center/media/logo/smooth.svg", alt="Chromatone logo" title="Chromatone")


  button(
    :inert="theoryOpen"
    @click="theoryOpen = !theoryOpen"
    :class="{ active: theoryOpen || route.path.includes('theory') }"
    title="Theory"
    aria-label="Toggle theory navigation panel"
    v-tooltip.right="'Theory'"
    )
    .i-la-book
  button(
    :inert="practiceOpen"
    @click="practiceOpen = !practiceOpen"
    :class="{ active: practiceOpen || route.path.includes('practice') }"
    title="Practice"
    aria-label="Toggle practice navigation panel"
    v-tooltip.right="'Practice'"
    )
    .i-la-hand-point-up

  .spacer

  button(
    title="Search"
    :inert="searchOpen"
    @click="searchOpen = !searchOpen"
    :class="{ active: searchOpen, 'touch-action-none': searchOpen }"
    v-tooltip.right="'Search'"
    aria-label="Toggle search panel"
    )
    .i-la-search

  .spacer

  a.button(
    title="Shop"
    href="/shop/"
    :class="{ active: route.path.includes('shop') }"
    v-tooltip.right="'Shop'"
    aria-label="Shop"
    )
    .i-la-shopping-bag

  a.button(

    title="tutor"
    href="/tutor/"
    :class="{ active: route.path.includes('tutor') }"
    v-tooltip.right="'Tutorship'"
    aria-label="Tutorship"
    )
    .i-la-chalkboard-teacher

  //- a.button(
  //-   title="Projects"
  //-   href="/projects/"
  //-   :class="{ active: route.path.includes('projects') }"
  //-   v-tooltip.right="'Projects'"
  //-   aria-label="Projects"
  //-   )
  //-   .scale-100.i-la-layer-group

  a.button(
    title="Academy"
    href="/academy/"
    :class="{ active: route.path.includes('academy') }"
    v-tooltip.right="'Academy'"
    aria-label="Academy"
    )
    .scale-85.i-mdi-pillar

  //-  a.button(
    title="School"
    href="/school/"
    :class="{ active: route.path.includes('school') }"
    v-tooltip.right="'School'"
    aria-label="Visual Music School"
    )
    .scale-85.i-bxs-school

  //-  a.button(
    title="Contacts"
    href="/contacts/"
    :class="{ active: route.path.includes('contacts') }"
    v-tooltip.right="'Contacts'"
    aria-label="Contacts"
    )
    .i-la-at



  .flex-auto
  .spacer 

  button.rounded-full.scale-80.border-3.h-12.w-12(
    :inert="scaleOpen"
    @click="scaleOpen = !scaleOpen"  
    :class="{ active: scaleOpen }" 
    aria-label="Toggle synth panel"
    v-tooltip.right="'Synth settings'"
    :style="{ borderColor: noteColor(globalScale.tonic) }"
    ) 
      .-mt-2px.text-lg {{ notes[globalScale.tonic] }}


  button.scale-80.rounded-lg.flex.flex-col.gap-1.border-3.h-12.relative(
    :inert="transportOpen"
    @click="transportOpen = !transportOpen"  
    :class="{ active: transportOpen }" 
    aria-label="Toggle transport panel"
    v-tooltip.right="'Transport'"
    :style="{ borderColor: !tempo.blink ? tempo.color : '' }"
    ) 
    .i-mdi-metronome.-mt-6px.mb-4px
    .absolute.text-xs.-bottom-2px {{ tempo.bpm.toFixed() }}

  //- button.scale-80.rounded-lg.flex.flex-col.gap-1.border-3.h-12.relative(
  //-   :inert="pianoOpen"
  //-   @click="pianoOpen = !pianoOpen"  
  //-   :class="{ active: pianoOpen }" 
  //-   aria-label="Toggle synth panel"
  //-   v-tooltip.right="'Synth settings'"
  //-   :style="{ borderColor: midi.note.velocity > 0 ? noteColor(midi.note.pitch, 4, midi.note.velocity) : 'currentColor' }"
  //-   ) 
  //-   .i-mdi-piano

  button(
    :inert="settingsOpen"
    @click="settingsOpen = !settingsOpen"  
    :class="{ active: settingsOpen }" 
    aria-label="Toggle audio input/output panel"
    v-tooltip.right="'Audio input/output'"
    :style="{ color: mic.opened ? 'red' : '' }"
    )
    .i-la-microphone

  .spacer


  button(
    @click="drawingEnabled = !drawingEnabled"
    :class="{ active: drawingEnabled }"
    v-tooltip.right="'Draw on the screen'"
    aria-label="Toggle screen drawing"
    )
    .i-carbon-pen 
  state-dark
  full-screen


client-only

  BarPanel(v-model="scaleOpen")
    synth-font.sticky.top-0.z-100
    .flex.gap-2 
      button.text-button(@click="midi.offset--")
        .i-la-minus
      .text-button {{ midi.offset }}
      button.text-button(@click="midi.offset++")
        .i-la-plus
    control-scale.w-full
    chord-tabs-neck.max-h-80dvh(
      :instrument="instrument"
      )
    .is-group.flex.gap-1.p-2.mb-8
      button.text-button(:class="{ active: instrument == 'guitar' }" @click="instrument = 'guitar'") Guitar
      button.text-button(:class="{ active: instrument == 'ukulele' }" @click="instrument = 'ukulele'") Ukulele


  BarPanel(v-model="transportOpen")
    state-transport
    midi-panel

  BarPanel(v-model="settingsOpen")
    state-sound

  BarPanel(v-model="searchOpen")
    nav-search.m-4(@close="searchOpen = false" :focus="searchOpen")

  BarPanel(v-model="theoryOpen")
    a.text-2xl.p-2.m-2.block.font-bold.flex.gap-2.items-center(
      href="/theory/"
      ) 
      .i-la-book
      .p-0 Theory
    BarLevel(path="/theory/" :level="0")

  BarPanel(v-model="practiceOpen")
    a.text-2xl.p-2.m-2.block.font-bold.flex.gap-2.items-center(
      href="/practice/"
      ) 
      .i-la-hand-point-up
      .p-0 Practice
    BarLevel(path="/practice/" :level="0" @close="practiceOpen = false")
</template>

<style lang="postcss" scoped>
nav.bar {
  @apply bg-light-800 dark-bg-dark-400 fixed z-1000 top-0 bottom-0 w-12 shadow flex flex-col items-center max-h-100dvh pb-2 overflow-scroll;
  scrollbar-width: none;
}

nav button,
nav a.button {
  @apply transition text-2xl p-2 flex flex-col items-center opacity-70 hover-opacity-100 grayscale-30;


}

button.active,
.button.active {
  @apply opacity-100 grayscale-0
}


.text-button.active {
  @apply bg-light-200 bg-dark-200 opacity-100 grayscale-0
}

.panel {
  @apply flex flex-col gap-4 transition fixed bg-light-200 z-900 top-0 bottom-0 left-0 shadow-lg ml-12 overflow-scroll p-2 dark-bg-dark-200 max-w-340px pb-8;

  & h2 {
    @apply my-4 text-2xl
  }

}

.spacer {
  @apply w-full bg-dark-200/40 dark-bg-light-100/30 p-0.5px my-1
}
</style>