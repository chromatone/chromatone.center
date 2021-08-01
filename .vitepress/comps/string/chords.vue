<template lang="pug">
.flex.flex-col.items-center
  .flex.flex-wrap
    button(
      :class="{ active: state.key == key }"
      v-for="key in ukulele.keys" :key="key"
      @click="state.key = key"
    ) {{ key }}
  .flex.flex-wrap
    button(
      :class="{ active: state.suffix == suffix }"
      v-for="suffix in ukulele.suffixes" :key="suffix"
      @click="state.suffix = suffix"
    ) {{ suffix }}
  .p-2.text-2xl.font-bold {{ state.key }} {{ state.suffix }}
  .flex.flex-wrap
    .p-2( v-for="pos in state.chord.positions" :key="pos" ) {{ pos }}
</template>

<script setup>
import { notes } from 'chromatone-theory'
import ukulele from '../../use/ukulele.json'
const state = reactive({
  key: ukulele.keys[0],
  suffix: ukulele.suffixes[0],
  chord: computed(() => {
    return ukulele.chords[state.key].find(chord => chord.suffix == state.suffix)
  })
});


</script>

<style scoped>
button {
  @apply p-2 shadow m-1;
  &.active {
    @apply font-bold;
  }
}
</style>