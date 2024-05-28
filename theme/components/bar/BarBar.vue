<script setup>
import { onClickOutside, onKeyDown } from "@vueuse/core";
import { useRoute, useData } from "vitepress";
import { drawingEnabled, drawingPinned } from '../../composables/draw'
import { ref } from "vue";
import { tempo } from "#/use/tempo";
import { globalScale, noteColor } from "#/use";
import { mic } from "#/use/mic";

import FullScreen from '../global/FullScreen.vue'

const route = useRoute()
const { isDark, theme } = useData()

const { open: searchOpen, panel: searchPanel } = usePanel()
const { open: practiceOpen, panel: practicePanel } = usePanel()
const { open: theoryOpen, panel: theoryPanel } = usePanel()
const { open: settingsOpen, panel: settingsPanel } = usePanel()
const { open: transportOpen, panel: transportPanel } = usePanel()
const { open: pianoOpen, panel: pianoPanel } = usePanel()

function usePanel() {
  const open = ref(false)
  const panel = ref()

  onClickOutside(panel, () => {
    open.value = false
  })

  onKeyDown('Escape', () => {
    open.value = false
  })
  return { open, panel }
}


</script>

<template lang='pug'>
nav.bar
  a(
    href="/"
    v-tooltip.right="'Chromatone'"
    aria-label="Back to main page"
    )
    img.cursor-pointer.mt-4.mx-2.mb-2(v-if="theme.logo", :src="theme.logo", alt="Chromatone logo" title="Chromatone")

  button(
    @click="theoryOpen = !theoryOpen"
    :class="{ active: theoryOpen || route.path.includes('theory') }"
    title="Theory"
    aria-label="Toggle theory navigation panel"
    v-tooltip.right="'Theory'"
    )
    .i-la-book
  button(
    @click="practiceOpen = !practiceOpen"
    :class="{ active: practiceOpen || route.path.includes('practice') }"
    title="Practice"
    aria-label="Toggle practice navigation panel"
    v-tooltip.right="'Practice'"
    )
    .i-la-hand-point-up
  a.button(
    title="tutor"
    href="/tutor/"
    :class="{ active: route.path.includes('tutor') }"
    v-tooltip.right="'Tutorship'"
    aria-label="Tutorship"
    )
    .i-la-chalkboard-teacher

  a.button(
    title="Shop"
    href="/shop/"
    :class="{ active: route.path.includes('shop') }"
    v-tooltip.right="'Shop'"
    aria-label="Shop"
    )
    .i-la-shopping-bag

  a.button(
    title="Academy"
    href="/academy/"
    :class="{ active: route.path.includes('academy') }"
    v-tooltip.right="'Academy'"
    aria-label="Academy"
    )
    .i-cil-education
  a.button(
    title="Contacts"
    href="/contacts/"
    :class="{ active: route.path.includes('contacts') }"
    v-tooltip.right="'Contacts'"
    aria-label="Contacts"
    )
    .i-la-at

  .spacer

  button(
    title="Search"
    @click="searchOpen = !searchOpen"
    :class="{ active: searchOpen }"
    v-tooltip.right="'Search'"
    aria-label="Toggle search panel"
    )
    .i-la-search

  .flex-auto
  .spacer 

  button(
  @click="pianoOpen = !pianoOpen"  
  :class="{ active: pianoOpen }" 
  aria-label="Toggle synth panel"
  v-tooltip.right="'Synth settings'"
  :style="{color: noteColor(globalScale.tonic)}"
  )
    .i-mdi-piano
  button(
    @click="transportOpen = !transportOpen"  
    :class="{ active: transportOpen }" 
    aria-label="Toggle transport panel"
    v-tooltip.right="'Transport'"
    :style="{color: tempo.blink ? tempo.color : ''}"
    )
    .i-mdi-metronome
  button(
    @click="settingsOpen = !settingsOpen"  
    :class="{ active: settingsOpen }" 
    aria-label="Toggle audio input/output panel"
    v-tooltip.right="'Audio input/output'"
    :style="{color: mic.opened ? 'red': ''}"
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
  transition(name="slide")
    .panel(
      ref="pianoPanel"
      v-show="pianoOpen"
      )
      control-scale.w-full
      synth-panel
  transition(name="slide")
    .panel(
      ref="transportPanel"
      v-show="transportOpen"
      )
      state-transport
      midi-panel

  transition(name="slide")
    .panel(
      ref="settingsPanel"
      v-show="settingsOpen"
      )
      state-sound



transition(name="slide")
  .panel(
    ref="searchPanel"
    v-if="searchOpen"
    )
    nav-search.mt-4(@close="searchOpen = false" :focus="searchOpen")

transition(name="slide")
  .panel(
    ref="theoryPanel"
    v-if="theoryOpen"
    )
    a.text-xl.p-2.my-2.block(
      href="/theory/"
      ) Theory
    BarLevel(path="/theory/" :level="0")

transition(name="slide")
  .panel(
    ref="practicePanel"
    v-if="practiceOpen"
    )
    a.text-xl.p-2.my-2.block(
      href="/practice/"
      ) Practice
    BarLevel(path="/practice/" :level="0")
</template>

<style lang="postcss" scoped>
nav.bar {
  @apply bg-light-800 dark-bg-dark-400 fixed z-1000 top-0 bottom-0 w-12 shadow flex flex-col max-h-100dvh pb-2 overflow-scroll;
}

button,
a.button {
  @apply transition text-2xl p-2 flex flex-col items-center opacity-70 hover-opacity-100;

  &.active {
    @apply bg-light-200 dark-bg-dark-200 opacity-100
  }
}

.panel {
  @apply flex flex-col gap-4 transition fixed bg-light-200 z-900 top-0 bottom-0 left-0 shadow-lg ml-12 overflow-scroll p-2 dark-bg-dark-200 max-w-340px pb-8;

  & h2 {
    @apply my-4 text-2xl
  }
}

.spacer {
  @apply bg-dark-200/40 dark-bg-light-100/30 p-0.5px my-1 mx-1
}
</style>