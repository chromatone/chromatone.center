<template lang="pug">
polygon.chord-trigger(
  :transform="'rotate(' + 60 * p + ')'", 
  @mousedown.stop.prevent="playChord", 
  @touchstart.stop.prevent="playChord", 
  @mouseleave.stop.prevent="stopChord", 
  @mouseup.stop.prevent="stopChord", 
  @touchend.stop.prevent="stopChord", 
  :class="{ deactivated: !active }", 
  :fill="pitchColor(note.pitch)", 
  points="0,0 80,0 80,46.188 40,69.28")
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { pitchColor, pitchFreq } from 'chromatone-theory'
import { attack, release } from '@use/synth.js'

const props = defineProps({
  note: Object,
  chord: Object,
  p: Number,
  activeSteps: Array,
});



const chordNotes = computed(() => {
  return props.chord.map((x) => x + props.note.pitch)
});

const active = computed(() => {
  let active = true
  let chord = chordNotes.value.map((x) => (x > 11 ? x % 12 : x))
  let activity = chord.forEach(note => {
    if (!props.activeSteps[note]) {
      active = false
    }
  })
  return active
});

function playChord() {
  attack(calcChord(chordNotes.value))
};

function stopChord() {
  release(calcChord(chordNotes.value))
};

function calcChord(chord) {
  return chord.map(x => pitchFreq(x))
}

</script>

<style scoped>
.chord-trigger {
  opacity: 0.5;
  mix-blend-mode: screen;
}
.deactivated {
  opacity: 1;
  mix-blend-mode: normal;
  fill: #999;
  stroke: #aaa;
}
</style>