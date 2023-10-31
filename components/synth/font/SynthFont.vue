<script setup>
//https://danigb.github.io/smplr/
//https://github.com/danigb/smplr

import { midi } from "#/use/midi";
import { SplendidGrandPiano, Soundfont, getSoundfontNames, getSoundfontKits, Reverb, } from "smplr";
import { ref, watch } from "vue";

const instrument = ref('marimba')

const loaded = ref(false)

const ctx = new AudioContext()

// const piano = new SplendidGrandPiano(ctx);
const piano = new Soundfont(ctx, { instrument: instrument.value })

const reverb = new Reverb(ctx);
piano.output.addEffect("reverb", reverb, 0.8);

piano.load.then(() => {
  loaded.value = true
});

watch(() => midi.note, note => {
  if (!loaded.value) return
  console.log(note.type)
  if (note.type == "noteon") {

    piano.start({ note: note.number, velocity: note.velocity });
  } else {
    piano.stop(note.number)
  }
})
</script>

<template lang='pug'>
.flex.flex-col.gap-2 SOUND FONT: 
  .flex.gap-2
    .text-xl.capitalize.font-bold {{ instrument }}
    .p-0(v-if="!loaded") Loading...
    .p-0(v-else) Loaded!
  .flex.flex-wrap.gap-1
    .bg-light-900.dark-bg-dark-900.p-1.text-xs(
      v-for="name in getSoundfontNames()" :key="name"
      :class="{['font-bold']:name == instrument}"
      ) {{ name }}
</template>