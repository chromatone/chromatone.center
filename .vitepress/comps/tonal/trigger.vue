<template lang="pug">
polygon.chord-trigger(
  style="mix-blend-mode: screen;"
  :transform="'rotate(' + 60 * p + ')'", 
  @mousedown="playChord()", 
  @mouseenter="pressed ? playChord() : null"
  @touchstart="playChord()", 
  @mouseleave="stopChord()", 
  @mouseup="stopChord()", 
  @touchend="stopChord()", 
  @touchcancel="stopChord()"
  :fill="playing ? pitchColor(note.pitch) : active ? pitchColor(note.pitch, 0.5) : pitchColor(note.pitch, 1, 0.2)",
  :opacity="1"
  :stroke-width="1"
  stroke="#fff"
  points="0,0 80,0 80,46.188 40,69.28")
</template>

<script setup>
import { computed, ref } from 'vue'
import { pitchColor, pitchFreq, notes } from 'chromatone-theory'
import { Frequency } from 'tone'
import { synthAttack, synthRelease } from '@use/synth.js'
import { midiAttack, midiRelease } from '@use/midi.js'

const props = defineProps({
  pressed: Boolean,
  note: Object,
  chord: Object,
  p: Number,
  activeSteps: Array,
});

const playing = ref(false)

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
    return Frequency(pitchFreq(pitch)).transpose(-12).toNote()
  })
})



function playChord() {
  playing.value = true
  synthAttack(chordNames.value)
  midiAttack(chordNames.value)
};

function stopChord() {
  playing.value = false
  synthRelease(chordNames.value)
  midiRelease(chordNames.value)
};

</script>

<style scoped>
</style>