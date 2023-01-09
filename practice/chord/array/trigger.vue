<script setup>
import { pitchFreq } from '#/use/calculations'
import { Frequency } from 'tone'
import { synthAttack, synthRelease } from '#/use/synth'
import { midiPlay, midiStop } from '#/use/midi'
import { computed, ref } from 'vue';

const props = defineProps({
  pressed: Boolean,
  note: { type: Object, default: () => { } },
  chord: { type: Object, default: () => { } },
  p: { type: Number, default: 0 },
  activeSteps: { type: Array, default: () => [] },
});

const playing = ref(false)

const chordPitches = computed(() => {
  return props.chord.map((x) => x + props.note.pitch)
});

const active = computed(() => {
  let active = true
  let chord = chordPitches.value.map((x) => (x > 11 ? x % 12 : x))
  chord.forEach(note => {
    if (props.activeSteps[note] != '1') {
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
  midiPlay(chordNames.value)
}

function stopChord() {
  playing.value = false
  synthRelease(chordNames.value)
  midiStop(chordNames.value)
}

</script>

<template lang="pug">
polygon.chord-trigger(
  style="mix-blend-mode: screen;"
  :transform="'rotate(' + 60 * p + ')'", 
  :fill="playing ? noteColor(note.pitch) : active ? noteColor(note.pitch, 0.5) : noteColor(note.pitch, -2, 0.1)",
  :opacity="1"
  :stroke-width="active ? 4 : 0.5"
  stroke="hsla(0,0%,100%,0.5)"
  points="0,0 80,0 80,46.188 40,69.28"
  @mousedown="playChord()", 
  @mouseenter="pressed ? playChord() : null"
  @touchstart="playChord()", 
  @mouseleave="stopChord()", 
  @mouseup="stopChord()", 
  @touchend="stopChord()", 
  @touchcancel="stopChord()")
</template>

<style lang="postcss" scoped>

</style>