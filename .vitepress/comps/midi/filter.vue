<template lang="pug">
.flex.is-group
  .flex.flex-wrap
    .channel(
      v-for="ch in 16" :key="ch"
      :class="{ filtered: !midi.filter[ch], active: midi.note.channel == ch }"
      @click="midi.filter[ch] = !midi.filter[ch]"
    ) {{ ch }}
  .channel.filtered.flex.items-center.justify-center(
    @click="filterAll()"
  ) ALL

</template>

<script setup>
import { midi, midiRelease } from '@use/midi'

function filterAll() {
  let state = midi.filter[1]

  for (let i = 1; i <= 16; i++) {
    midi.filter[i] = !state
  }
  if (state) midiRelease()
}

</script>

<style scoped>
.channel {
  @apply transition-all duration-100 select-none px-2px py-5px m-2px min-w-22px text-0.75rem text-center cursor-pointer border-1 rounded-lg;
  flex: 1 1 10%;
  &.filtered {
    @apply bg-light-900 dark_bg-dark-100;
  }
  &.active {
    @apply border-current;
  }
}
</style>