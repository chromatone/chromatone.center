<script setup>
//https://danigb.github.io/smplr/
//https://github.com/danigb/smplr

import { midi } from "#/use/midi";
import { useStorage } from "@vueuse/core";
import { SplendidGrandPiano, Soundfont, getSoundfontNames, getSoundfontKits, Reverb, } from "smplr";
import { ref, watch, computed } from "vue";

const instrument = useStorage('sound-font', 'marimba')

const loaded = ref(false)

const ctx = new AudioContext()

const reverb = new Reverb(ctx);

const inst = computed(() => {
  loaded.value = false
  const ins = new Soundfont(ctx, {
    instrument: instrument.value,
  })
  ins.output.addEffect("reverb", reverb, 0.8);
  ins.load.then(() => {
    loaded.value = true
  });
  return ins
})

watch(() => midi.note, note => {
  if (!loaded.value) return
  if (note.type == "noteon") {
    inst.value.start({ note: note.number, velocity: note.velocity });
  } else {
    inst.value.stop(note.number)
  }
})
</script>

<template lang='pug'>
.flex.flex-col.gap-2 
  .p-2.flex.flex-wrap.gap-2 SOUND FONT:   
    .font-bold {{ inst.config.instrument }}
    .flex
      .p-0(v-if="!loaded") Loading...
      .p-0(v-else) Loaded!
  .flex.flex-wrap.gap-1
    .bg-light-900.dark-bg-dark-900.p-1.text-xs(
      v-for="name in getSoundfontNames()" :key="name"
      @click="instrument = name"
      :class="{['font-bold']:name == instrument}"
      ) {{ name }}
</template>