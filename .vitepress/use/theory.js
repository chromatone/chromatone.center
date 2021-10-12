import { pianoAttack, pianoRelease, pianoReleaseAll, pianoOnce } from './piano'
import { Note, ChordType, ScaleType, Scale, Pcset } from '@tonaljs/tonal'
import { Frequency } from 'tone'
import { midiPlay, midiStop } from '@use/midi.js'
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

export const intervals = [
  '1P',
  '2m',
  '2M',
  '3m',
  '3M',
  '4P',
  'TT',
  '5P',
  '6m',
  '6M',
  '7m',
  '7M',
]

let noteNames = []

const naturals = [
  'A',
  'A#',
  'B',
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
]

const sharps = [
  'G##',
  'A#',
  'A##',
  'B#',
  'C#',
  'C##',
  'D#',
  'D##',
  'E#',
  'F#',
  'F##',
  'G#',
]
const flats = [
  'Bbb',
  'Bb',
  'Cb',
  'Dbb',
  'Db',
  'Ebb',
  'Eb',
  'Fb',
  'Gbb',
  'Gb',
  'Abb',
  'Ab',
]
naturals.forEach((note, n) => {
  noteNames[note] = n
})
sharps.forEach((note, n) => {
  noteNames[note] = n
})
flats.forEach((note, n) => {
  noteNames[note] = n
})

export { notes, noteNames, rotateArray }

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

export function clampNum(main, delta, min = 0, max = 100) {
  let num = Number(main) + Number(delta)
  if (num < min) {
    num = min
  }
  if (num > max) {
    num = max
  }
  return num
}
