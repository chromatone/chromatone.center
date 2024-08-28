<script setup>
import { useClamp } from '@vueuse/math';
import { onMounted, shallowRef, ref, computed } from 'vue'
import { Interval, Range, Scale } from 'tonal';
import { globalScale, playNoteOnce } from '#/use';
import { getDraw, Part } from 'tone';

const vowels = ["e", "i", "a", "o", "u", "y"]
const consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"]

const allNotes = computed(() => Range.numeric([-7, 8]).map(Scale.steps(globalScale.full.name)))

const words = shallowRef([])
const loaded = ref(false)
const currentIndex = useClamp(0, 0, () => words.value.length)
const currentWord = computed(() => words.value[currentIndex.value])
const splittedWord = computed(() => splitWord(currentWord.value))

const vowelFreqs = computed(() => getFreqs(vowels))
const orderedVowels = computed(() => vowels.toSorted((a, b) => vowelFreqs.value[a] >= vowelFreqs.value[b] ? -1 : 1))

const consonantFreqs = computed(() => getFreqs(consonants))
const orderedConsonants = computed(() => consonants.toSorted((a, b) => consonantFreqs.value[a] >= consonantFreqs.value[b] ? -1 : 1))



const part = computed(() => {
  const Draw = getDraw()

  let list = allNotes.value.map((n, i) => ({ time: i / 4, duration: '32n', note: n }))

  let par = new Part((time, val) => {
    Draw.schedule(() => {
      playNoteOnce(val.note, val.duration)
    }, time);
  }, list).start('0')
  par.loop = true
  par.loopStart = 0
  par.loopEnd = '4m'
  return par
})

onMounted(async () => {
  let { default: ws } = await import('an-array-of-english-words')
  words.value = ws

  loaded.value = true
  randomWord()
})

function randomWord() {
  currentIndex.value = Math.floor(Math.random() * words.value.length)
}

function getFreqs(arr) {
  const freqs = {}
  arr.forEach(v => freqs[v] = 0)
  words.value.forEach(word => {
    for (let letter of word) {
      if (letter in freqs) {
        freqs[letter]++
      }
    }
  })
  let full = Object.values(freqs).reduce((prev, val) => prev + val, 0)

  for (let freq in freqs) {
    freqs[freq] = freqs[freq] / full
  }
  return freqs
}

function splitWord(word) {
  if (!word) return []
  const regex = /(?<consonant>[^aeiouy]?)(?<vowel>[aeiouy]*)/g;
  const matches = Array.from(word.matchAll(regex));
  return matches.reduce((acc, match) => {
    const consonant = match.groups.consonant;
    const vowels = match.groups.vowel;
    if (consonant || vowels) {
      acc.push([consonant || '', vowels || '']);
    }
    return acc;
  }, []);
}

</script>

<template lang='pug'>
//- .text-12px.font-mono
//-   span.p-1(v-for="word in words.slice(0, 800)" :key="word") {{ word }}
.flex.flex-col.gap-4.p-2
  .text-2xl.flex.gap-2 WORDS {{ part }}
    .p-0(v-if="!loaded") Loading...

  .flex.is-group
    button.text-button(@click="currentIndex--") Prev
    button.text-button(@click="randomWord()") Pick random
    button.text-button(@click="currentIndex++") Next
  .op-50.text-sm.font-mono {{ currentIndex }}/{{ words?.length }} 
  .text-2xl {{ currentWord }}
  .flex.gap-2
    .p-0.flex.gap-2px(v-for="syllable in splittedWord" :key="syllable") 
      .p-0(v-for="letter in syllable" :key="letter") {{ letter }}

  hr
  .text-xl Letter frequencies in all {{ words?.length }}  words
  .flex.gap-2.is-group.p-2
    .bg-light-100.dark-bg-dark-200.p-1.text-md(v-for="(vowel) in orderedVowels" :key="vowel" :style="{ flex: `${vowelFreqs[vowel]}` }") {{ vowel.toUpperCase() }} 
      .op-50 {{ (vowelFreqs[vowel] * 100).toFixed() }}%
  .flex.flex-wrap.gap-2.is-group.p-2
    .p-1.bg-light-100.dark-bg-dark-200(v-for="(cons, c) in orderedConsonants" :key="cons" :style="{ flex: `${(consonantFreqs[cons] * 1000).toFixed(1)}` }") {{ cons }} 
      .op-30 {{ allNotes[c] }}
      .op-50 {{ (consonantFreqs[cons] * 100).toFixed(1) }}%
</template>