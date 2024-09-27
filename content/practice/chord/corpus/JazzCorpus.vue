<script setup>
import jazz from '#/db/corpus.yaml'
import { computed, ref } from 'vue';



const sorted = computed(() => jazz.toSorted((a, b) => a.Title < b.Title ? -1 : 1))

const currentSong = ref(sorted.value[0])
</script>

<template lang='pug'>
.flex.gap-2.p-2 
  .flex.flex-col.max-h-100vh.overflow-scroll(
    style="flex: 1 1 100px")
    .flex.flex-col.gap-1.cursor-pointer.hover-bg-light-900.dark-hover-bg-dark-900.p-1.transition(
      @click="currentSong = song"
      v-for="song in sorted" :key="song.filename") 
      .flex.items-baseline.flex-wrap.gap-1
        .text-md.font-bold {{ song.Title }} 
        .text-sm by {{ song.ComposedBy }}
        .text-sm ({{ song.DBKeySig }}, {{ song.TimeSig[0] }}/{{ song.TimeSig[1] }}, {{ song.Bars }} bars )

  .flex.p-2.flex-col.gap-2( style="flex: 1 1 200px")
    transition(name="fade")
      .flex.flex-col(:key="currentSong.Title")
        .text-xl.font-bold {{ currentSong.Title }}
        .text-md by {{ currentSong.ComposedBy }}
        .text-sm {{ currentSong.DBKeySig }}, {{ currentSong.TimeSig[0] }}/{{ currentSong.TimeSig[1] }}, {{ currentSong.Bars }} bars 
    transition(name="fade")
      .flex.flex-col.gap-1(:key="currentSong.Title")
        .flex.gap-1(v-for="line in currentSong.chords" :key="line")
          .p-0.flex-1(v-for="chord in line" :key="chord") {{ chord }}
</template>