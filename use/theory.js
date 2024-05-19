/**
 * @module MusicTheory
 */

import { ChordType, } from '@tonaljs/tonal'
import ChordChoice from '../db/chord/choice.yaml'
import ScaleChoice from '../db/scale/choice.yaml'

// import scaleNames from '../db/scale/scale-names.yaml'

// for (let s in scaleNames) {
//   const scale = scaleNames[s]
//   const intervals = Pcset.intervals(scale.chroma)
//   ScaleType.add(intervals, scale.title, Object.values(scale.names).flat())
// }


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

export const intervals = ['1P', '2m', '2M', '3m', '3M', '4P', 'TT', '5P', '6m', '6M', '7m', '7M']

export const noteNames = []

export const naturals = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
export const sharps = ['G##', 'A#', 'A##', 'B#', 'C#', 'C##', 'D#', 'D##', 'E#', 'F#', 'F##', 'G#']
export const flats = ['Bbb', 'Bb', 'Cb', 'Dbb', 'Db', 'Ebb', 'Eb', 'Fb', 'Gbb', 'Gb', 'Abb', 'Ab']

naturals.forEach((note, n) => {
  noteNames[note] = n
})
sharps.forEach((note, n) => {
  noteNames[note] = n
})
flats.forEach((note, n) => {
  noteNames[note] = n
})

export const notes = naturals

export const chords = ChordChoice
export const scales = ScaleChoice
