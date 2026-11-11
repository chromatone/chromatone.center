/**
 * @module Global
 * @description Global state
 */

import { notes } from './theory.js'
import { ScaleType, Scale, Pcset } from "tonal";
import { reactive, computed } from 'vue'
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
  // chroma is tonic-relative: bit i belongs to pitch class (tonic + i) % 12.
  // inScale(pitch) checks a pitch class (0-11, notes[] order) against the scale.
  inScale: (pitch) => globalScale.chroma[(pitch - globalScale.tonic + 12) % 12] === '1',
  // velocity multiplier applied to notes outside the scale
  suppressed: 0.5,
  noteVelocity: (pitch, velocity = 1) => globalScale.inScale(pitch) ? velocity : velocity * globalScale.suppressed,
});

globalThis.__chromatoneGlobalScale = globalScale;
