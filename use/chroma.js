/**
 * @module Chroma
 * @description Global scale info and chroma
 */

import { Frequency } from "tone";
import { midiPlay, midiStop, playKey, stopAll } from "./midi";
import { rotateArray } from "./calculations";
import { notes } from './theory'
import { Note, ScaleType, Scale, Pcset } from "tonal";
import { reactive, computed, nextTick } from 'vue'
import { useStorage } from "@vueuse/core";
import { useClamp } from "@vueuse/math";

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

function getChromaNotes(chroma = globalScale.chroma, tonic = globalScale.tonic) {
  let shiftChroma = rotateArray(chroma.split(""), -tonic);
  let chOct = rotateArray(allNotes, -tonic).map((n) => {
    let noteName = Frequency(n.pitch + tonic + 57, "midi").toNote();
    return noteName;
  });
  let filtered = chOct.filter((val, i) => {
    if (shiftChroma[i] == "1") {
      return true;
    }
  });
  return Note.sortedNames(filtered);
}

export function playChromaOnce(chroma, tonic) {
  let notes = getChromaNotes(chroma, tonic);
  playNoteOnce(notes)
}

export function playChroma(chroma, tonic) {
  let notes = getChromaNotes(chroma, tonic);
  playNote(notes)
}

export function stopChroma(chroma, tonic) {
  let notes = getChromaNotes(chroma, tonic);
  stopNote(notes)
}

export function playNoteOnce(note, velocity, duration = 300) {
  playNote(note, velocity)
  setTimeout(() => stopNote(note), duration)
}


export function playNote(note, velocity = 0.9) {
  if (Array.isArray(note)) {
    note.forEach(n => playNote(n))
  } else {
    playKey(note, velocity)
  }
}

export function stopNote(note) {
  if (!note) {
    stopAll()
    return
  }
  if (Array.isArray(note)) {
    note.forEach(n => stopNote(n))
  } else {
    playKey(note, 0)
  }
}
