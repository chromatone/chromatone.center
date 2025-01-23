<script setup>
import { flats, naturals, noteColor, noteNames } from "#/use";
import ChordSheetJS from "chordsheetjs";
import { Chord } from "tonal";
import { computed, onMounted, reactive, ref, watch } from "vue";
import { decode, encode } from "universal-base64url";
import { useClipboard, useStorage } from "@vueuse/core";

const parser = new ChordSheetJS.ChordsOverWordsParser();
const formatter = new ChordSheetJS.HtmlDivFormatter();

const instrument = ref("ukulele");

const chordSheet = useStorage(
  "chord-sheet",
  `title: Let's go to the party
subtitle: Flow it live
artist: Your name
composer: May be it's also you?
key: Dm
time: 4/4
tempo: 110
comment: Feel the flow of music and the energy of the audience
chordsize: 200%
textsize: 120%
---
Dm              Bb           F            A
Feel the sound, let it flow, deep inside, let it show
Gm          F/A         Bb        A
Every note, every beat, brings us close
Dm             Bb           F               A
Live the song, every chord, let the message unfold
Gm       F/A           Bb     A          A7    Dm
We start out, you tune in, in live music we're flowing`
);

const favs = useStorage('chord-sheets-favs', {})

const song = ref()
const chordMap = ref({})

watch(
  chordSheet,
  (ch) => {
    song.value = parser.parse(ch);
  },
  { immediate: true }
);

const result = computed(() => formatter.format(song.value));

const parsed = computed(() => {
  const p = new DOMParser().parseFromString(result.value, "text/html");
  const chords = p.querySelectorAll(".chord");
  const chordList = {};
  chords.forEach((chord) => {
    let c = chord?.innerHTML;
    if (!c) return;
    chordList[c] = chordList[c] ? ++chordList[c] : 1;
    let tonic = Chord.get(c).tonic;
    let pitch = naturals.findIndex((t) => t == tonic);
    if (pitch == -1) pitch = flats.findIndex((t) => t == tonic);
    chord.style.color = noteColor(pitch);
    chord.style.background = noteColor(pitch, 1, 1, 0.1);
    chord.style.borderRadius = "4px"
    chord.style.padding = "4px"
  });
  chordMap.value = chordList

  return new XMLSerializer().serializeToString(p);
});

const chords = computed(() => {
  return Object.entries(chordMap.value)
    .sort((a, b) => (a[1] > b[1] ? -1 : 1))
    .map((c) => c[0])
    .map((c) => Chord.get(c));
});

const hash = ref();

onMounted(() => {
  console.log(parsed.value)
  hash.value = window.location.hash.slice(1);
  if (!hash.value) return;
  try {
    chordSheet.value = decode(hash.value);
  } catch (e) {
    console.log(e);
  }
  window.location.hash = "";

});

const hashUrl = computed(
  () => `${window.location}#${encode(chordSheet.value)}`
);

const { copy, copied } = useClipboard({
  source: hashUrl,
});
</script>

<template lang="pug">
.flex.gap-2.p-4.gap-4.flex-wrap.chords.z-100

  textarea.p-4.min-h-90(autoresize style="flex: 1 1 200px" v-model="chordSheet")

  .p-4.bg-light-100.dark-bg-dark-300.shadow-xl.rounded-xl(style="flex: 1 1 300px" v-html="parsed")

  #favs.flex.items-center.gap-4.flex-wrap.w-full.p-4.rounded-xl.shadow-lg(popover)
    .text-2xl.flex-full Songs collection
    button.p-2.flex.items-center.bg-light-100.rounded-xl.shadow.hover-shadow-lg.transition(
      style="flex: 1 1 220px"
      v-for="(fav, f) in favs" :key="fav" @click="chordSheet = fav" :class="{ ['bg-stone-300']: chordSheet == fav }" ) 
      .text-lg() {{ f }}
      .flex-1
      button.op-50.hover-op-80.active-op-100.hover-text-red.transition(@click.stop="delete favs[f]")
        .i-la-times

  .flex.gap-2.p-4.flex-wrap
    button.text-button(
      popovertarget="favs"
      @click="favs[song.title] = chordSheet" data-modal="favs") 
      .i-la-star(v-if="favs[song.title] != chordSheet")
      .i-la-star-solid(v-else)

    button.text-button(@click="song = song.transposeUp()") Transpose Up
    button.text-button(@click="song = song.transposeDown()") Transpose Down
    .is-group.flex
      button.text-button.disabled-op-40(@click="instrument = 'piano'" :disabled="instrument == 'piano'") Piano     
      button.text-button.disabled-op-40(@click="instrument = 'guitar'" :disabled="instrument == 'guitar'") Guitar
      button.text-button.disabled-op-40(@click="instrument = 'ukulele'" :disabled="instrument == 'ukulele'") Ukulele
    button.text-button(@click="copy()") {{ copied ? 'Copied' : 'Copy URL' }}

  .flex.flex-wrap.p-4.gap-4.bg-light-100.dark-bg-dark-300.shadow-xl.rounded-xl(style="flex: 1 1 280px" )
    .p-0.flex.flex-col(style="flex: 1 1 140px" v-for="chord in chords" :key="chord") 
      .flex.gap-2.justify-between.whitespace-nowrap.px-2
        .flex-1 {{ chord.symbol }} 
        .flex-1 
        .op-60.flex-1 {{ chord.name }}
      chroma-keys(
        v-if="instrument == 'piano'"
        :title="false"
        :chroma="chord.chroma" :pitch="noteNames[chord.tonic]")
      chord-tab.max-w-40(
        v-if="instrument == 'ukulele' || instrument == 'guitar'"
        v-model:instrument="instrument"
        :title="false"
        :chroma="chord.chroma" :pitch="noteNames[chord.tonic]")

</template>

<style lang="postcss">
[popover]::backdrop {
  transition: all 0.7s allow-discrete;
  backdrop-filter: blur(8px);
}

[popover][open]::backdrop {
  transition: all 0.7s allow-discrete;
  backdrop-filter: blur(5px);
}

[popover] {
  position: fixed;
  top: 2px;
  display: none;
  width: fit-content;
  height: fit-content;
}

[popover]:popover-open {
  display: flex;
  inset: unset;
  margin: 0;
}

.chords h1,
.chords h2 {
  margin: 0;
  padding: 0;
}

.chords h2 {
  font-size: 1.2em;
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
