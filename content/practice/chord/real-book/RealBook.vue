<script setup>
import jazz from '#/db/chord/real-book.yaml'
import { noteNames, pitchColor } from '#/use'
import { computed, ref } from 'vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import { Chord } from 'tonal';
import { useStorage } from '@vueuse/core';
import { globalChord } from '#/use/global'

jazz.sort((a, b) => a.Title < b.Title ? -1 : 1)

const currentFile = useStorage('real-book-song', jazz[0].filename)

const currentSong = computed(() => jazz.find(s => s.filename == currentFile.value))

const searchText = ref('')

const { results } = useFuse(searchText, jazz, {
  matchAllWhenSearchEmpty: true, fuseOptions: {
    keys: ['Title', 'ComposedBy'],
    includeScore: true,
  }
})


</script>

<template lang='pug'>
.flex.gap-2.p-2.gap-1(style="line-height: 1.2em;")
  .flex.flex-col.max-h-100vh.overflow-scroll.gap-1.op-80.hover-op-100.transition.overscroll-none(
    style="flex: 0 0 160px")
    .flex.p-2.sticky.top-0.bg-light-400.dark-bg-dark-400.items-center.bg-op-80.dark-bg-op-80.backdrop-blur.z-1001
      .i-la-search.absolute.left-4.op-70.touch-action-none.pointer-events-none(v-if="!searchText")
      input.p-2.rounded-lg.w-full(v-model="searchText")
      button.absolute.right-4.op-40.hover-op-90.transition(@click="searchText = ''")
        .i-la-times

    template(v-for="song in results" :key="song.item.filename")
      .song.flex.flex-col.cursor-pointer.hover-bg-light-900.dark-hover-bg-dark-900.p-1.transition(
        v-if="!song.score || song.score < 0.4"
        @click="currentFile = song.item.filename;"
        :class="{ active: currentFile == song.item.filename }"
        )
        .flex.items-baseline.flex-wrap.gap-2.relative
          .flex.items-baseline.w-full
            .font-bold {{ song.item.Title }}
            .flex-auto
            .rounded-full.px-1.text-xs.font-bold(:style="{ backgroundColor: pitchColor(noteNames[song.item.DBKeySig], 4, 1, .5) }") {{ song.item.DBKeySig }}
          .text-sm {{ song.item.ComposedBy }}
          .flex-auto
          .text-sm.absolute.bottom-0.right-0  {{ song.item.TimeSig[0] }}/{{ song.item.TimeSig[1] }}

  .flex.flex-col.gap-4.overflow-x-scroll.w-full.overscroll-none.overflow-y-scroll.max-h-100vh( style="flex: 3 1 200px")
    transition(name="fade" mode="out-in")
      .flex.flex-col.sticky.left-0.top-0.p-4.bg-light-500.bg-op-60.backdrop-blur.dark-bg-dark-500.dark-bg-op-60(:key="currentSong.filename")
        .flex.w-full.items-center
          .text-xl.font-bold {{ currentSong.Title }}
          .flex-auto
          .rounded-full.px-2.py-1.text-lg.font-bold(:style="{ backgroundColor: pitchColor(noteNames[currentSong.DBKeySig], 4, 1, .5) }") {{ currentSong.DBKeySig }}
        .text-md {{ currentSong.ComposedBy }}
        .text-sm  {{ currentSong.TimeSig[0] }}/{{ currentSong.TimeSig[1] }}, {{ currentSong.Bars }} bars 

    transition(name="fade" mode="out-in")
      .flex.flex-col.gap-4(:key="currentSong.Title")
        .flex.gap-2(v-for="line in currentSong.chords" :key="line")
          .flex-1.flex.gap-.rounded.overflow-hidden.cursor-pointer(v-for="chord in line" :key="chord") 
            .flex-1.p-1.flex.font-bold.text-sm.filter.hover-brightness-150(
              @click="globalChord.name = ch"
              v-for="ch in chord.split(' ')" :key="ch"
              :style="{ backgroundColor: pitchColor(noteNames[Chord.get(ch).tonic], 4, 1, .3) }"
              ) {{ ch }} 
    youtube-embed.my-16(v-if="currentSong.youtube" :video="currentSong.youtube")
  chord-sheet
</template>

<style lang="postcss" scoped>
.song.active {
  @apply bg-dark-100 bg-op-20 dark-bg-dark-100 sticky top-13 bottom-6 z-100
}
</style>