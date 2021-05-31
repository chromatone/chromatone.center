<template lang="pug">
g
  circle.note-circle(
    @mousedown.stop.prevent="playNote", 
    @touchstart.stop.prevent="playNote",
    @mouseup.stop.prevent="stopNote", 
    @mouseleave.stop.prevent="stopNote", 
    @touchend.stop.prevent="stopNote", 
    :r="r", 
    :cx="0", 
    :cy="0", 
    :class="{ deactivated: !active, tonic: tonic == note.pitch }", 
    stroke-width="2", 
    :fill="note.color")
  text.note-name(
    text-anchor="middle", 
    fill="white", 
    :x="0", 
    :y="8") {{ note.name }}
</template>

<script setup>
import { defineProps, ref } from 'vue'
const props = defineProps({
  note: Object,
  r: Number,
  active: Boolean,
  tonic: Number,
});

const playing = ref(false)

function playNote() {
  console.log(props.note, props.tonic)
  playing.value = true
  // if (!Tone.contextStarted) {
  //   Tone.context.resume()
  // }
  // this.playing = true
  // Synth.chromaSynth.set(Synth.chromaOptions)
  // let octave = this.root > this.note.pitch ? 4 : 3
  // Synth.chromaSynth.triggerAttack(
  //   Synth.calcFrequency(this.note.pitch, octave),
  // )
};
function stopNote() {
  console.log(props.pitch, props.tonic)
  playing.value = false
  // this.playing = false
  // let octave = this.root > this.note.pitch ? 4 : 3
  // Synth.chromaSynth.triggerRelease(
  //   Synth.calcFrequency(this.note.pitch, octave),
  // )
};

</script>

<style scoped>
</style>