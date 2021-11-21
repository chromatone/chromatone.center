import { Frequency } from 'tone'
import { midiPlay, midiStop } from '@use/midi.js'
import { synthOnce, synthAttack, synthRelease } from '@use/synth.js'
import { notes, rotateArray } from 'chromatone-theory'
import { Note, ChordType, ScaleType, Scale, Pcset } from '@tonaljs/tonal'

export const globalScale = reactive({
  tonic: useStorage('global-tonic', 0),
  note: computed(() => notes[globalScale.tonic]),
  chroma: useStorage('global-chroma', '101011010101'),
  setNum: useStorage('seq-scale', 2708),
  set: computed(() => ScaleType.get(globalScale.chroma)),
  full: computed(() => {
    let sc = globalScale.note.name + '4 ' + globalScale.set.name
    return Scale.get(sc)
  }),
  pcs: computed(() => Scale.scaleNotes(globalScale.full.notes)),
  isIn: computed(() => Pcset.isNoteIncludedIn(globalScale.pcs)),
})

function getChromaNotes(chroma = '100010010000', tonic = globalScale.tonic) {
  let shiftChroma = rotateArray(chroma.split(''), -tonic)
  let chOct = rotateArray(notes, -tonic).map((n, i) => {
    let noteName = Frequency(n.pitch + tonic + 57, 'midi').toNote()
    return noteName
  })
  let filtered = chOct.filter((val, i) => {
    if (shiftChroma[i] == '1') {
      return true
    }
  })
  return Note.sortedNames(filtered)
}

export function playChromaOnce(chroma, tonic) {
  let notes = getChromaNotes(chroma, tonic)

  notes.forEach((name, i) => {
    midiOnce(name)
  })
  synthOnce(notes, '4n')
  // pianoOnce(notes, '4n')
}

export function playChroma(chroma, tonic) {
  let notes = getChromaNotes(chroma, tonic)
  notes.forEach((name) => {
    midiPlay(name)
  })
  synthAttack(notes)
  // pianoAttack(notes)
}

export function stopChroma(chroma, tonic) {
  let notes = getChromaNotes(chroma, tonic)
  notes.forEach((name) => {
    midiStop(name)
  })
  synthRelease(notes)
  // pianoRelease(notes)
}

export function playNote(name) {
  midiPlay(name)
  synthAttack(name)
  // pianoAttack(notes)
}

export function stopNote(name) {
  midiStop(name)
  synthRelease(name)
  // pianoRelease(notes)
}
