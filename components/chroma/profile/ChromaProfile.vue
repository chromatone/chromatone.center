<script setup>
import { Interval, Pcset } from '@tonaljs/tonal'
import { notes } from '#/use/theory'
import { chromaColorMix } from "#/use/colors";
import { chordType, scaleType } from '#/use/theory'
import { playChroma, stopChroma, globalScale } from '#/use/chroma'
import { reactive, computed } from 'vue'

const props = defineProps({
  title: { type: String, default: null },
  chroma: { type: String, default: '1001000100000' },
  abc: { type: String, default: null },
  link: { type: String, default: null, },
  description: { type: String, default: '' },
  editable: { type: Boolean, default: false }
});

const emit = defineEmits(['update:chroma'])

const info = reactive({
  chord: computed(() => chordType.get(props.chroma)),
  scale: computed(() => scaleType.get(props.chroma)),
})

const chord = computed(() => chordType.get(props.chroma));
const scale = computed(() => scaleType.get(props.chroma));
const intervals = computed(() => Pcset.intervals(props.chroma));
const semitones = computed(() => {
  let arr = []
  if (!intervals.value) return []
  for (let i = 1; i < intervals.value.length; i++) {
    arr[i - 1] = (Interval.semitones(intervals.value[i]) - Interval.semitones(intervals.value[i - 1]))
  }
  return arr
});

function toggleNote(ev) {
  console.log(ev, props.chroma, globalScale.tonic)
  let ch = props.chroma
  const diff = (12 - globalScale.tonic + ev) % 12
  console.log(diff)
  if (diff == 0) return
  let sp = ch.split('')
  sp[diff] = sp[diff] == '0' ? '1' : '0'
  emit('update:chroma', sp.join(''))

}
</script>

<template lang="pug">
.profile(
  :style="{ borderColor: chromaColorMix(chroma, globalScale.tonic).hsl }"
)
  chroma-profile-waveform(
    :chroma="chroma" 
    )

  .flex.w-full.relative.px-4
    a.p-2.absolute.top-8px.right-2em(
      v-if="link"
      :href="link"
      target="_blank"
      )
      .i-la-wikipedia-w
    .text-2xl.font-bold.capitalize.mb-2(
      ) {{ notes[globalScale.tonic] }} {{ chord.name || chord.aliases[0] || scale.name || title  }} {{ scale.aliases[0] ? `(${scale.aliases[0]})` : '' }}

  abc-render(v-if="abc" :abc="abc")

  .flex.items-center.mx-2.w-full.gap-2

    chroma-keys(
      style="flex: 1 1 400px;"
      :chroma="chroma" @update:chroma="$emit('update:chroma',$event)" :pitch="globalScale.tonic" :title="false" @update:pitch="toggleNote" :playAll="true") 

    chroma-circle(
      style="flex: 1 1 250px;"
      :chroma="chroma") 

    chroma-code(:chroma="chroma" @update:chroma="$emit('update:chroma',$event)")

  chroma-row.mx-2.mb-2(
    :chroma="chroma" @update:chroma="$emit('update:chroma',$event)" :editable="editable")
  //- chroma-stack.flex-1.mx-4(:chroma="chroma")
  //- chroma-square.w-12em.mx-4(:chroma="chroma" :editable="editable")
  .p-4 {{ description }}
</template>

<style lang="postcss" scoped>
.profile {
  @apply flex flex-wrap max-w-60ch border-2 rounded-3xl shadow-lg bg-light-500 dark-bg-dark-500 gap-2 mx-auto;
}
</style>