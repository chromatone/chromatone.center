/**
 * @module Chroma
 * @description Chroma 
 */

import { playNote, playNoteOnce, stopNote } from "./midi";
import { rotateArray } from "./calculations";
import { globalScale } from "./global";

function getChromaNotes(chroma = globalScale.chroma, tonic = globalScale.tonic, inversion = 0) {
  // Get the initial notes array
  const notes = Array(12).fill(true)
    .map((_, n) => n + tonic + 57)
    .filter((_, n) => {
      if (rotateArray(chroma.split(""), -tonic)[n] == "1") {
        return true;
      }
    });

  // If inversion is 0 or invalid, return original array
  if (inversion <= 0 || inversion >= notes.length) {
    return notes;
  }

  // Rotate the array by inversion steps and adjust octaves
  const rotatedNotes = [...notes.slice(inversion), ...notes.slice(0, inversion)]
    .map((note, index) => {
      // Add 12 (one octave) to all notes that were moved to the end
      if (index >= notes.length - inversion) {
        return note + 12;
      }
      return note;
    });

  return rotatedNotes;
}

export function playChromaOnce(chroma, tonic, inversion) {
  playNoteOnce(getChromaNotes(chroma, tonic, inversion))
}

export function playChroma(chroma, tonic, inversion) {
  playNote(getChromaNotes(chroma, tonic, inversion))
}

export function stopChroma(chroma, tonic, inversion) {
  stopNote(getChromaNotes(chroma, tonic, inversion))
}

