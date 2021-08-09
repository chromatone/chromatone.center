<template lang="pug">
.flex.flex-col.items-center.max-w-xl.m-auto
  .flex.flex-wrap.justify-center
    button.p-2(
      v-for="(instrument,name) in instruments" :key="name"
      :class="{ active: state.instrument.main.name == name }"
      @click="current = name"
      ) {{ name }}
  .flex.flex-wrap.justify-center
    button.note(
      :style="{ backgroundColor: pitchColor(k) }"
      :class="{ active: state.key == key }"
      v-for="(key,k) in rotateArray(state.instrument.keys, -3)" :key="key"
      @click="state.key = key"
    ) {{ key }}
  .flex.flex-wrap
    button.text-sm.p-1(
      :class="{ active: state.suffix == suffix }"
      v-for="suffix in state.instrument?.suffixes" :key="suffix"
      @click="state.suffix = suffix"
    ) {{ suffix }}
  .p-2.text-2xl.font-bold {{ state.key }} {{ state.suffix }}
  .flex.flex-wrap.justify-center
    string-tab( 
      v-for="pos in state.chord?.positions" :key="pos" 
      v-bind="pos"
      )
</template>

<script setup>
import { notes, rotateArray, pitchColor } from 'chromatone-theory'
import ukulele from '../../db/ukulele.json'
import guitar from '../../db/guitar.json'
import { useStorage } from '@vueuse/core'
const instruments = {
  ukulele, guitar
}
const current = useStorage('string-instrument', 'ukulele')
const state = reactive({
  instrument: computed(() => instruments[current.value]),
  key: ukulele.keys[0],
  suffix: ukulele.suffixes[0],
  chord: computed(() => {
    return state.instrument.chords[state.key].find(chord => chord.suffix == state.suffix)
  })
});


</script>

<style scoped>
button {
  @apply shadow m-1 rounded;
  &.note {
    @apply text-white font-bold p-2 opacity-30;
  }
  &.active {
    @apply font-bold opacity-100;
  }
}
</style>