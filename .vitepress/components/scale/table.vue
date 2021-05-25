<template lang="pug">
.flex.flex-col
  .row.top
    scale-chroma(
      :scale="{ chroma: '111111111111' }"
      :tonic="tonic"
      @setTonic="tonic = $event; play($event)"
      title="Choose tonic"
      :fav="false"
      )
  transition-group(name="list")
    .row(v-for="scale in allScales", :key="scale.setNum")
      scale-chroma(
        :scale="scale"
        :tonic="tonic"
        @setTonic="play($event)"
        @play="play($event)"
        @star="toggleStar(scale.setNum)"
        :title="scale.name",
        :fav="stars[scale.setNum]"
        )

</template>

<script setup>
import { defineProps, ref, onMounted, computed, onBeforeUnmount } from 'vue'
import { useStorage } from '@vueuse/core'
import { ScaleType } from '@tonaljs/tonal'
import { PolySynth, Frequency } from 'tone'

let starScales = {}

ScaleType.all().forEach(scale => {
  starScales[scale.setNum] = true
})

const tonic = ref(0);

const stars = useStorage('starsSc', starScales)

const allScales = computed(() => {
  return ScaleType.all().sort((a, b) => {
    if (stars.value[a.setNum] && !stars.value[b.setNum]) return 1
    else if (!stars.value[a.setNum] && stars.value[b.setNum]) return -1
    else if (a.length < b.length) return -1
    else if (a.length > b.length) return 1
    else return a.chroma < b.chroma ? -1 : 1
  })
})



let synth

onMounted(() => {
  synth = new PolySynth().toDestination()
  synth.set({
    envelope: {
      attack: 0.05,
      decay: 0.8,
      sustain: 1.0,
      release: 2
    }
  })
})

onBeforeUnmount(() => {
  synth.disconnect().dispose()
})

function play(note) {
  if (tonic.value > 0 && note < tonic.value) {
    note = note + 12
  }
  let freq = Frequency(note + 57, 'midi')
  synth.triggerAttackRelease(freq, '8n')
};

function toggleStar(num) {
  stars.value[num] = !stars.value[num]
}

</script>

<style lang="postcss" scoped>
.title {
  @apply text-lg font-bold p-4;
  flex: 0 1 300px;
}

.row {
  @apply p-2 items-center max-w-65ch m-auto;
}

.row.top {
  @apply sticky rounded-md top-60px bg-light-200 shadow-md dark:bg-dark-200;
}
</style>