<template lang="pug">
polygon.chord-trigger(
  style="mix-blend-mode: screen;"
  :transform="'rotate(' + 60 * p + ')'", 
  @mousedown.stop.prevent="playChord", 
  @touchstart.stop.prevent="playChord", 
  @mouseleave.stop.prevent="stopChord", 
  @mouseup.stop.prevent="stopChord", 
  @touchend.stop.prevent="stopChord", 
  :fill="active ? pitchColor(note.pitch) : pitchColor(note.pitch, 1, 0.2)",
  :opacity="1"
  :stroke-width="1"
  stroke="#fff"
  points="0,0 80,0 80,46.188 40,69.28")
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { pitchColor, pitchFreq, notes } from 'chromatone-theory'
import { Frequency } from 'tone'
import { synthAttack, synthRelease } from '@use/synth.js'
import { midiAttack, midiRelease } from '@use/midi.js'

const props = defineProps({
  note: Object,
  chord: Object,
  p: Number,
  activeSteps: Array,
});



const chordPitches = computed(() => {
  return props.chord.map((x) => x + props.note.pitch)
});

const active = computed(() => {
  let active = true
  let chord = chordPitches.value.map((x) => (x > 11 ? x % 12 : x))
  let activity = chord.forEach(note => {
    if (!props.activeSteps[note]) {
      active = false
    }
  })
  return active
});

const chordNames = computed(() => {
  return chordPitches.value.map(pitch => {
    return Frequency(pitchFreq(pitch)).toNote()
  })
})



function playChord() {
  synthAttack(chordNames.value)
  midiAttack(chordNames.value)
};

function stopChord() {
  synthRelease(chordNames.value)
  midiRelease(chordNames.value)
};

</script>

<style scoped>
</style>