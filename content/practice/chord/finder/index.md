---
title: Finder
description: Easily find different chords note colors
cover: chord.svg
date: 2022-01-20
---

<script setup>
import chordFinder from './finder.vue'
import { Progression, Chord, Note } from '@tonaljs/tonal'
import { notes } from '#/use/theory'
import { globalScale } from '#/use/chroma'
import { computed } from 'vue'

const chords = computed(() => Progression.fromRomanNumerals(notes[globalScale.tonic], `bII7, iim6, III7, ivm6, V7, #vm6, vim6, bVII7, VIIo7`.split(', ')))

const chordsInfo = computed(()=>chords.value.map(ch =>Chord.get(ch).notes.map(Note.simplify)))

</script>


To get a chord notes select it's type and then click on the root note circle.

<client-only >
 <chord-finder />
</client-only >


<!-- ### Secondary chords


<chroma-keys class="max-w-80" v-model:pitch="globalScale.tonic"></chroma-keys>

 {{ chords }}

<pre class="text-xs">{{ chordsInfo }}</pre>  -->