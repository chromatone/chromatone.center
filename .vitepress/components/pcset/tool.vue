<template lang="pug">
.flex.flex-col
  .relative.w-full.m-auto
    svg-save(svg="circle", :file="`${notes[tonic].name}-${chroma}-circle.svg`")  
    pcset-circle#circle(
      v-model:chroma="chroma"
      v-model:tonic="tonic"
      :scaleChroma="scaleChroma"
      @clearScale="clearScale()"
      )
  .flex.flex-wrap.m-auto
    .chord-group(
      v-for="(name,count) in groupNames", 
      :key="name"
      :class="{ active: count + 2 == numNotes }"
      @click="chroma = chordGroups[count][0].chroma"
      ) {{ name }}
  .flex.flex-col.items-center
    .flex.flex-wrap.my-4.justify-center
      .chord(
        v-for="chord in chordGroup", 
        :key="chord?.aliases[0]", 
        @click="chroma = chord.chroma",
        :class="{ active: chord?.chroma == chroma }") {{ chord?.aliases[0] }}
  .flex.flex-wrap
    .text-xl.flex-1.min-w-full.text-center.my-4
      .text-sm in
    transition-group(name="list")
      .chord(
        v-for="name in chordScales",
        :key="name"
        @click="scale = name"
        :class="{ active: scale == name }"
        ) {{ name }}
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { chords, notes, pitchColor } from 'chromatone-theory'
import { ChordType, Chord, ScaleType } from '@tonaljs/tonal'
import { useStorage } from '@vueuse/core'

const chordList = ChordType.all()
const tonic = useStorage('tonic', 0)
const chroma = useStorage('chroma', chordList[0].chroma)

const groupNames = ['Intervals', 'Triads', 'Tetrads', 'Pentads', 'Hexads', 'Heptads']

const chordGroups = computed(() => {
  let arr = []
  for (let i = 0; i < 6; i++) {
    arr[i] = chordList.filter(get => get.intervals.length === i + 2)
  }
  return arr
})

const chord = computed(() => {
  return ChordType.get(chroma.value)
})

const chordScales = computed(() => {
  return Chord.chordScales(chord.value.aliases[0]) || []
})

const scale = useStorage('scale', chordScales.value[0])
function clearScale() { scale.value = '' }
const scaleTonic = useStorage('scaleTonic', 0)

const scaleChroma = computed(() => {
  return ScaleType.get(scale.value).chroma
})

const numNotes = computed(() => {
  return chroma.value.split('').reduce((acc, val) => Number(acc) + Number(val))
})

const chordGroup = computed(() => {
  return chordList.filter(get => get.intervals.length === numNotes.value)
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
  @apply p-2 transition-all cursor-pointer m-1 rounded-lg bg-light-500 dark:bg-dark-100 hover:bg-light-800 dark:(hover:bg-dark-300);
}

.chord.active {
  @apply bg-dark-100 text-light-300 hover:bg-dark-900 dark:(text-dark-600 bg-light-200 hover:(bg-light-900));
}

.chord-group {
  @apply cursor-pointer flex p-2 m-2 text-lg border-b-w-4 border-gray-500 transition-all box-content border-opacity-0;
}

.chord-group.active {
  @apply font-bold border-b-w-4 border-opacity-100;
}
</style>