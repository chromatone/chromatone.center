<template lang="pug">
.flex.flex-col
  chords-circle#circle(:accord="accord", @selectRoot="accord.root = $event")
  .flex.justify-center
    a.absolute.text-2xl.-m-1rem.right-2rem(target="_blank",:download="`${notes[accord?.root].name}${accord?.info.handle}-circle.svg`",:href="download.circle", v-if="download.circle")
      la-save
  .flex.flex-wrap.my-4.justify-center
    .chord(
      v-for="chord in chordList", 
      :key="chord?.handle", 
      @click="accord.info = chord",
      :class="{ active: chord?.handle == accord.info.handle }") {{ chord?.handle }}

  chords-keys#keys(:accord="accord", @selectRoot="accord.root = $event")
  .text-4xl.mt-4.text-center.font-bold(
    :style="{ color: noteColor(accord.root) }"
  ) {{ notes[accord?.root].name }}{{ accord?.info.handle }}
    a.absolute.text-2xl.right-2rem(target="_blank",:download="`${notes[accord?.root].name}${accord?.info.handle}-keys.svg`",:href="download.keys", v-if="download.keys")
      la-save
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { chords, notes, noteColor } from 'chromatone-theory'

const accord = reactive({
  root: 0,
  info: chords.min,
});

const download = reactive({
  circle: '',
  keys: ''
})

watch(accord, () => {
  setTimeout(() => {
    saveSVG('circle')
    saveSVG('keys')
  }, 100);

})


function saveSVG(pic) {
  var svg = document.getElementById(pic);
  if (!svg) return
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  download[pic] = url;
}

const chordList = computed(() => {
  let list = Object.values(chords)
  return list.sort(compareChords)
});


function compareChords(a, b) {
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