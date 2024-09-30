<script setup>
import { globalChord } from '#/use/global'
import { onClickOutside } from '@vueuse/core';
import { ref } from 'vue';

const sheet = ref()
onClickOutside(sheet, () => globalChord.name = '')
</script>

<template lang="pug">
.fixed.bottom-4.right-4.mx-auto.flex.flex-col.p-2.rounded-lg.shadow.backdrop-blur.bg-light-200.bg-op-80.dark-bg-dark-200.dark-bg-op-80.w-auto.max-w-90vw.min-w-80(
  ref="sheet"
  v-if="!globalChord.data.empty")
  button.absolute.top-2.right-2(@click="globalChord.name = ''")
    .i-la-times
  .flex.flex-wrap.gap-2.items-baseline
    .text-2xl {{ globalChord.name }} {{ globalChord.pitch }}
    .text-lg {{ globalChord.data.name }}
  .p-1 {{ globalChord.data.chroma }}
  .flex.flex-wrap.gap-2
    .p-1 Aliases:
    .p-1(v-for="alias in globalChord.data.aliases" :key="alias") {{ alias }}
  .flex.flex-wrap.gap-2
    .p-1 Intervals:
    .p-1(v-for="interval in globalChord.data.intervals" :key="interval") {{ interval }}
  .flex.flex-wrap.gap-2
    .p-1 Notes:
    .p-1(v-for="note in globalChord.data.notes" :key="note") {{ note }}
</template>