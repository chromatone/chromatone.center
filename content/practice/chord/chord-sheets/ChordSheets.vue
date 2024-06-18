<script setup>
import { flats, naturals, noteColor, noteNames } from '#/use';
import ChordSheetJS from 'chordsheetjs'
import { Chord } from 'tonal';
import { useRoute } from 'vitepress';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { decode, encode } from "universal-base64url";
import { useClipboard, useStorage } from '@vueuse/core';

const parser = new ChordSheetJS.ChordsOverWordsParser()
const formatter = new ChordSheetJS.HtmlDivFormatter()

const instrument = ref('ukulele')

const chordSheet = useStorage('chord-sheet', `title: Let it be
subtitle: Chord sheet example
artist: You
composer: You later
key: Am
time: 4/4
tempo: 110
comment: your test chordsheet
chordsize: 120%
textsize: 120%
---

Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be

Am         C/G        F          C
Let it be, let it be, let it be, let it be
C                G              F  C/E Dm C
Whisper words of wisdom, let it be`)


const song = ref()
const chordMap = ref({})

watch(chordSheet, ch => {
       song.value = parser.parse(ch)
}, { immediate: true })

const result = computed(() => formatter.format(song.value))

const parsed = computed(() => {
       const p = (new DOMParser).parseFromString(result.value, "text/html")
       const chords = p.querySelectorAll('.chord')
       const chordList = {}
       chords.forEach(chord => {

              let c = chord?.innerHTML
              if (!c) return
              chordList[c] = chordList[c] ? ++chordList[c] : 1;
              let tonic = Chord.get(c).tonic
              let pitch = naturals.findIndex(t => t == tonic)
              if (pitch == -1) pitch = flats.findIndex(t => t == tonic)
              chord.style.color = noteColor(pitch)
              chord.style.background = noteColor(pitch, 1, 1, 0.1)
              chord.style.borderRadius = '4px'
              chord.style.padding = '2px'
       })

       const final = (new XMLSerializer()).serializeToString(p)
       chordMap.value = chordList
       return final
})

const chords = computed(() => {
       return Object.entries(chordMap.value).sort((a, b) => a[1] > b[1] ? -1 : 1).map(c => c[0]).map(c => Chord.get(c))
})

const hash = ref()

onMounted(() => {
       hash.value = window.location.hash.slice(1)
       if (!hash.value) return
       try {
              chordSheet.value = decode(hash.value)
       } catch (e) { console.log(e) }
       window.location.hash = ''
})

const hashUrl = computed(() => `${window.location}#${encode(chordSheet.value)}`)

const { copy, copied } = useClipboard({
       source: hashUrl
})

</script>

<template lang="pug">
.flex.gap-2.p-4
       button.text-button(@click="song = song.transposeUp()") Transpose Up
       button.text-button(@click="song = song.transposeDown()") Transpose Down
       .is-group.flex
              button.text-button.disabled-op-40(@click="instrument = 'piano'" :disabled="instrument == 'piano'") Piano     
              button.text-button.disabled-op-40(@click="instrument = 'guitar'" :disabled="instrument == 'guitar'") Guitar
              button.text-button.disabled-op-40(@click="instrument = 'ukulele'" :disabled="instrument == 'ukulele'") Ukulele
       button.text-button(@click="copy()") {{ copied ? 'Copied' : 'Copy URL' }}
.flex.gap-2.p-4.gap-4.flex-wrap.chords

       textarea.p-4.min-h-90(autoresize style="flex: 1 1 200px" v-model="chordSheet")

       .p-4.bg-light-100.dark-bg-dark-300.shadow-xl.rounded-xl(style="flex: 1 1 300px" v-html="parsed")

       .flex.flex-wrap.p-4.gap-4.bg-light-100.dark-bg-dark-300.shadow-xl.rounded-xl(style="flex: 1 1 280px" )
              .p-0.flex.flex-wrap(style="flex: 1 1 140px" v-for="chord in chords" :key="chord") 
                     .w-full.flex.gap-2.justify-between.whitespace-nowrap
                            .flex-1 {{ chord.symbol }} 
                            .flex-1 
                            .op-60.flex-1 {{ chord.name }}
                     chroma-keys(
                            v-if="instrument == 'piano'"
                            :title="false"
                            :chroma="chord.chroma" :pitch="noteNames[chord.tonic]")
                     chord-tab.max-w-40(
                            v-if="instrument == 'ukulele' || instrument =='guitar'"
                            :instrument
                            :title="false"
                            :chroma="chord.chroma" :pitch="noteNames[chord.tonic]")

</template>

<style lang="postcss">
.chords h1,
.chords h2 {
       margin: 0;
       padding: 0;
}

.chords h2 {
       font-size: 1.2em
}

.chords .paragraph {
       font-family: monospace;
}

.chords .row {
       display: flex;
       align-items: end;
       min-height: 40px;
       margin-bottom: 10px;
       @apply whitespace-nowrap;
}

.chords .column {
       margin-right: 4px;
}

.chords .chord {
       min-height: 20px;
       font-weight: bold;
}

.chords .chord.clickable {
       color: steelblue;
       cursor: pointer;
}

.chords .chord-container {
       display: flex;
       flex-direction: column;
       align-items: center;
       border: 1px solid red;
       text-align: center;
}

.chords .lyrics {
       min-height: 2em;
       display: flex;
       white-space: nowrap;
}
</style>