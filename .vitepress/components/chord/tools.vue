<template lang="pug">
.flex.flex-col
  .flex.flex-wrap.mt-4.justify-center
    .chord(
      v-for="chord in chordList", 
      :key="chord?.handle", 
      @click="accord.info = chord",
      :class="{ active: chord?.handle == accord.info.handle }") {{ chord?.handle }}
  chord-circle(
  id="svg",:accord="accord", @selectRoot="accord.root = $event")
  .flex.justify-center
    a.p-4(target="_blank",download="chord.svg",:href="download", v-if="download") Download
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { notes, noteColor, chords, scales } from 'chromatone-theory'

const accord = reactive({
  root: 0,
  info: chords.min,
});

const download = ref()
watch(accord, () => {
  setTimeout(() => {
    saveSVG()
  }, 100);

})


function saveSVG() {
  var svg = document.getElementById("svg");
  if (!svg) return
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  download.value = url;
}

const chordList = computed(() => {
  let list = Object.values(chords)
  return list.sort(compare)
});


function compare(a, b) {
  if (a.semitones.length < b.semitones.length) {
    return -1;
  }
  if (a.semitones.length > b.semitones.length) {
    return 1;
  }
  for (let i of [1, 2, 3]) {
    if (a.semitones[i] < b.semitones[i]) {
      return -1;
    }
    if (a.semitones[i] > b.semitones[i]) {
      return 1;
    }
  }
  return 0;
}

</script>

<style lang="postcss" scoped>
.chord {
  @apply text-xl p-2 transition-all cursor-pointer m-1 rounded-lg border bg-light-100 dark:bg-dark-100 hover:bg-light-500 dark:(hover:bg-dark-300);
  &.active {
    @apply bg-light-700 dark:bg-dark-700;
  }
}
</style>