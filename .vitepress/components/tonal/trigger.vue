<template lang="pug">
polygon.chord-trigger(
  :transform="'rotate(' + 60 * p + ')'", 
  @mousedown.stop.prevent="playChord", 
  @touchstart.stop.prevent="playChord", 
  @mouseleave.stop.prevent="stopChord", 
  @mouseup.stop.prevent="stopChord", 
  @touchend.stop.prevent="stopChord", 
  :class="{ deactivated: !active }", 
  :fill="note.color", 
  points="0,0 80,0 80,46.188 40,69.28")
</template>

<script setup>
import { defineProps, computed } from 'vue'
const props = defineProps({
  note: Object,
  chord: Object,
  activeSteps: Array,
});

const active = computed(() => {
  let active = true
  let chord = chordNotes.value.map((x) => (x > 11 ? x % 12 : x))
  let activity = chord.map((note) => {
    if (!props.activeSteps[note]) {
      active = false
    }
  })
  return active
});

const chordNotes = computed(() => {
  return props.chord.map((x) => x + props.note.pitch)
});

function playChord() {
  console.log(props.note, props.chord);
  //   if (!Tone.contextStarted) {
  //     Tone.context.resume()
  //   }
  //   Synth.chromaSynth.set(Synth.chromaOptions)
  //   Synth.chromaSynth.triggerAttack(Tone.calcChord(this.theChord))
};

function stopChord() {
  // Synth.chromaSynth.triggerRelease(Tone.calcChord(this.theChord))
};

</script>

<style scoped>
</style>