
import { ChordType, ScaleType } from '@tonaljs/tonal'


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

export const noteNames = []

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

