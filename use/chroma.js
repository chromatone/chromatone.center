/**
 * @module Chroma
 * @description Chroma 
 */

import { Frequency } from "tone";
import { playNote, playNoteOnce, stopNote } from "./midi";
import { rotateArray } from "./calculations";
import { notes } from './theory'
import { Note } from "tonal";
import { globalScale } from "./global";

const allNotes = [...notes].map((n, i) => ({ name: n, pitch: i }))

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

