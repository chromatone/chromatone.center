import { Note, ChordType, ScaleType, Scale, Pcset } from '@tonaljs/tonal'
import { Frequency } from 'tone'
import { midiOnce, midiAttack, midiRelease } from '@use/midi.js'
import { synthOnce, synthAttack, synthRelease } from '@use/synth.js'
import { notes, rotateArray } from 'chromatone-theory'

ChordType.add(['1P', '2m'], ['2m'], 'minor second')
ChordType.add(['1P', '2M'], ['2M'], 'major second')
ChordType.add(['1P', '3m'], ['3m'], 'minor third')
ChordType.add(['1P', '3M'], ['3M'], 'major third')
ChordType.add(['1P', '4P'], ['4P'], 'perfect fourth')
ChordType.add(['1P', '5d'], ['TT'], 'tritone')

ChordType.add(['1P', '5P'], ['5P'], 'perfect fifth')
ChordType.add(['1P', '6m'], ['6m'], 'minor sixth')
ChordType.add(['1P', '6M'], ['6M'], 'major sixth')
ChordType.add(['1P', '7m'], ['7m'], 'minor seventh')
ChordType.add(['1P', '7M'], ['7M'], 'major seventh')

export const chordType = ChordType
export const scaleType = ScaleType

export const chordList = ChordType.all()
export const scaleList = ScaleType.all()

export const globalScale = reactive({
  tonic: useStorage('tonic', 0),
  note: computed(() => notes[globalScale.tonic]),
  setNum: useStorage('seq-scale', 2708),
  set: computed(() => ScaleType.get(globalScale.setNum)),
  full: computed(() => {
    let sc = globalScale.note.name + '4 ' + globalScale.set.name
    return Scale.get(sc)
  }),
  pcs: computed(() => Scale.scaleNotes(globalScale.full.notes)),
  isIn: computed(() => Pcset.isNoteIncludedIn(globalScale.pcs)),
})

function getChromaNotes(chroma = '100010010000') {
  let shiftChroma = rotateArray(chroma.split(''), -globalScale.tonic)
  let chOct = rotateArray(notes, -globalScale.tonic).map((n, i) => {
    return Frequency(n.pitch + globalScale.tonic + 57, 'midi').toNote()
  })
  let filtered = chOct.filter((val, i) => {
    if (shiftChroma[i] == '1') {
      return true
    }
  })
  return Note.sortedNames(filtered)
}

export function playChromaOnce(chroma) {
  let notes = getChromaNotes(chroma)
  notes.forEach((name, i) => {
    midiOnce(name)
  })
  synthOnce(notes, '4n')
}

export function playChroma(chroma) {
  let notes = getChromaNotes(chroma)
  notes.forEach((name) => {
    midiAttack(name)
  })
  synthAttack(notes)
}

export function stopChroma(chroma) {
  let notes = getChromaNotes(chroma)
  notes.forEach((name) => {
    midiRelease(name)
  })
  synthRelease(notes)
}

export function playNote(name) {
  midiAttack(name)
  synthAttack(name)
}

export function stopNote(name) {
  midiRelease(name)
  synthRelease(name)
}
