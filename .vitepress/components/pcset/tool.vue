<template lang="pug">
.flex.flex-col
  .relative.w-full.m-auto
    svg-save(svg="circle", :file="`${notes[tonic].name}-${chroma}-circle.svg`")  
    pcset-circle#circle(
      v-model:chroma="chroma"
      v-model:tonic="tonic"
      @selectTonic="tonic = $event"
      @updateChroma="chroma = $event"
      )
  .flex.flex-wrap
    .flex.p-4.font-bold(v-for="(name,count) in groupNames", :key="name") {{ name }}
  .flex.flex-col.items-center(v-for="(group, i) in chordGroups", :key="group?.[0]?.chroma")
    .text-xl.font-bold {{ groupNames[i] }} chords
    .flex.flex-wrap.my-4.justify-center
      .chord(
        v-for="chord in group", 
        :key="chord?.setNum", 
        @click="chroma = chord.chroma",
        :class="{ active: chord?.chroma == chroma }") {{ chord?.aliases[0] }}
 
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { chords, notes, pitchColor } from 'chromatone-theory'
import { ChordType } from '@tonaljs/tonal'
import { useStorage } from '@vueuse/core'

const chordList = ChordType.all()
const tonic = useStorage('tonic', 0)
const chroma = useStorage('chroma', chordList[0].chroma)
const groupNames = ['Triad', 'Tetrad', 'Pentad', 'Hexad', 'Heptad']

const chordGroups = computed(() => {
  let arr = []
  for (let i = 0; i < 5; i++) {
    arr[i] = chordList.filter(get => get.intervals.length === i + 3)
  }
  return arr
})


const download = reactive({
  circle: '',
  keys: ''
})

watch([tonic, chroma], () => {
  setTimeout(() => {
    saveSVG('circle')
  }, 300);

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



</script>

<style lang="postcss" scoped>
.chord {
  @apply text-xl p-2 transition-all cursor-pointer m-1 rounded-lg bg-light-500 dark:bg-dark-100 hover:bg-light-800 dark:(hover:bg-dark-300);
}

.chord.active {
  @apply text-light-300 bg-dark-800 hover:bg-dark-900 dark:(text-dark-600 bg-light-200 hover:(bg-light-900));
}
</style>