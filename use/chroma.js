/**
 * @module Chroma
 * @description Chroma 
 */

import { playNote, playNoteOnce, stopNote } from "./midi.js";
import { rotateArray } from './calculations.js';
import { Note } from 'tonal';

function getDefaultScale() {
  return globalThis.__chromatoneGlobalScale || { chroma: '101011010101', tonic: 0 };
}

export function getChromaNotes(chroma = getDefaultScale().chroma, tonic = getDefaultScale().tonic, inversion = 0) {
  const notes = Array(12).fill(true)
    .map((_, n) => n + tonic + 57)
    .filter((_, n) => rotateArray(chroma.split(''), -tonic)[n] == '1');

  if (inversion <= 0 || inversion >= notes.length) {
    return notes.map(note => Note.fromMidi(note));
  }

  return [...notes.slice(inversion), ...notes.slice(0, inversion)]
    .map((note, index) => {
      if (index >= notes.length - inversion) {
        return Note.fromMidi(note + 12);
      }
      return Note.fromMidi(note);
    });
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

