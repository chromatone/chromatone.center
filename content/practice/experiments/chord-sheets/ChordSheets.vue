<script setup>
import ChordSheetJS from 'chordsheetjs'
import { computed, ref, watch } from 'vue';

const parser = new ChordSheetJS.ChordsOverWordsParser()
const formatter = new ChordSheetJS.HtmlDivFormatter()

const chordSheet = ref(`title: Let it be
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

watch(chordSheet, ch => {
       song.value = parser.parse(ch)
}, { immediate: true })

const result = computed(() => formatter.format(song.value))


</script>

<template lang="pug">
.flex.gap-2.p-4
       button.text-button(@click="song = song.transposeUp()") Transpose Up
       button.text-button(@click="song = song.transposeDown()") Transpose Down
.flex.gap-2.p-4.gap-4.flex-wrap.chords
       textarea.p-4.min-h-90(autoresize style="flex: 1 1 200px" v-model="chordSheet")
       .p-4.bg-light-100.dark-bg-dark-300.shadow-xl.rounded-xl(style="flex: 1 1 300px" v-html="result")
</template>

<style>
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
}

.chords .column {
       margin-right: 4px;
}

.chords .chord {
       min-height: 20px;
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