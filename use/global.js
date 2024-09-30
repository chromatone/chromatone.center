/**
 * @module Global
 * @description Global state
 */

import { noteNames, notes } from './theory'
import { Chord, ScaleType, Scale, Pcset, Range } from "tonal";
import { reactive, computed, nextTick, ref } from 'vue'
import { useStorage } from "@vueuse/core";
import { useClamp } from "@vueuse/math";
import { chromaColorMix } from './colors';
import { rotateArray } from './calculations';

const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i }))

export const globalScale = reactive({
  tonic: useClamp(useStorage("global-tonic", 0), 0, 11),
  note: computed(() => allNotes[globalScale.tonic]),
  chroma: useStorage("global-chroma", "101011010101"),
  set: computed(() => ScaleType.get(globalScale.chroma)),
  full: computed(() => {
    let sc = globalScale.note.name + "4 " + globalScale.set.name;
    return Scale.get(sc);
  }),
  pcs: computed(() => Scale.scaleNotes(globalScale.full.notes)),
  isIn: computed(() => Pcset.isNoteIncludedIn(globalScale.pcs)),
});

export const globalChord = reactive({
  name: 'A',
  data: computed(() => Chord.get(globalChord.name)),
  steps: computed(() => Chord.steps(globalChord.name)),
  pitch: computed(() => noteNames[globalChord.data.tonic]),
})