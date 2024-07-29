<script setup>
//https://danigb.github.io/smplr/
//https://github.com/danigb/smplr

import { useAudio } from "#/use/audio";
import { midi } from "#/use/midi";
import { useStorage } from "@vueuse/core";
import { Soundfont, getSoundfontNames, Reverb, } from "smplr";
import { ref, watch, computed, reactive } from "vue";

const instrument = useStorage('sound-font', 'marimba')

const cached = reactive([])

const { master } = useAudio()

watch(instrument, instr => {
  cached[instr] = true
})

const loaded = ref(false)

const ctx = master.context

const reverb = new Reverb(ctx);

const inst = computed(() => {
  loaded.value = false
  const ins = new Soundfont(ctx, {
    instrument: instrument.value,
  })
  ins.output.addEffect("reverb", reverb, 0.9);
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
.flex.flex-col.border.my-2.bg-light-900.dark-bg-dark-100.rounded-lg
  .flex.flex-wrap.gap-1.p-2.max-h-40vh.overflow-scroll
    button.transition.p-1.text-sm.cursor-pointer.border-1.border-dark-900.border-opacity-10.rounded.shadow.flex-auto.capitalize.dark-border-light-200.dark-border-opacity-20(
      v-for="name in getSoundfontNames()" :key="name"
      @click="instrument = name"
      :class="{ ['border-opacity-100 dark-border-opacity-90 filter filter-invert']: name == instrument, ['opacity-50']: name == instrument && !loaded, ['bg-light-100 dark-bg-dark-900']: !cached[name], ['bg-light-900 dark-bg-dark-100']: cached?.[name] }"
      ) {{ name.replaceAll('_', ' ') }}
  .flex.flex.gap-2.items-center.justify-center.p-2
    .font-bold.capitalize.text-xl {{ inst.config.instrument.replaceAll('_', ' ') }}
    .flex.text-
      .i-la-spinner.animate-pulse(v-if="!loaded")
      .i-la-check(v-else) Loaded!
  
</template>