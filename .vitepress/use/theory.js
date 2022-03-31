
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

export const intervals = ['1P', '2m', '2M', '3m', '3M', '4P', 'TT', '5P', '6m', '6M', '7m', '7M']

export const noteNames = []

const naturals = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',]
const sharps = ['G##', 'A#', 'A##', 'B#', 'C#', 'C##', 'D#', 'D##', 'E#', 'F#', 'F##', 'G#']
const flats = ['Bbb', 'Bb', 'Cb', 'Dbb', 'Db', 'Ebb', 'Eb', 'Fb', 'Gbb', 'Gb', 'Abb', 'Ab']

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


export const chords = {
  min: { handle: 'min', name: 'Minor', semitones: [0, 3, 7], },
  maj: { handle: 'maj', name: 'Major', semitones: [0, 4, 7], },
  aug: { handle: 'aug', name: 'Augmented', semitones: [0, 4, 8], },
  dim: { handle: 'dim', name: 'Diminished', semitones: [0, 3, 6], },
  M7: { handle: 'M7', name: 'Major 7th', semitones: [0, 4, 7, 11], },
  m7: { handle: 'm7', name: 'Minor 7th', semitones: [0, 3, 7, 10], },
  '7': { handle: '7', name: 'Dominant 7th', semitones: [0, 4, 7, 10], },
  '+7': { handle: '+7', name: 'Augmented 7th', semitones: [0, 4, 8, 10], },
  o7: { handle: 'o7', name: 'Diminished 7th', semitones: [0, 3, 6, 9], },
  '07': { handle: '07', name: 'Half-diminished 7th', semitones: [0, 3, 6, 10], },
  '+M7': { handle: '+M7', name: 'Augmented major 7th', semitones: [0, 3, 7, 11], },
  '6': { handle: '6', name: 'Major 6th', semitones: [0, 4, 7, 9], },
  m6: { handle: 'm6', name: 'Minor 6th', semitones: [0, 3, 7, 9], },
  sus2: { handle: 'sus2', name: 'Suspended 2nd', semitones: [0, 2, 7], },
  sus4: { handle: 'sus4', name: 'Suspended 4th', semitones: [0, 5, 7], },
  '9': { handle: '9', name: '9th', semitones: [0, 3, 7, 13], },
}


export const scales = {
  major: {
    handle: 'major',
    name: 'Major (Ionian)',
    chords: ['maj', '', 'min', '', 'min', 'maj', '', '7', '', 'min', '', 'dim'],
    steps: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  },
  minor: {
    handle: 'minor',
    name: 'Minor (Aeolian)',
    chords: ['min', '', 'dim', 'maj', '', 'min', '', 'min', 'maj', '', '7', ''],
    steps: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  },
  dorian: {
    handle: 'dorian',
    name: 'Dorian',
    chords: ['min', '', 'min', 'maj', '', '7', '', 'min', '', 'dim', 'maj', ''],
    steps: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
  },
  phrygian: {
    handle: 'phrygian',
    name: 'Phrygian',
    chords: ['min', 'maj', '', '7', '', 'min', '', 'dim', 'maj', '', 'min', ''],
    steps: [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  },
  lydian: {
    handle: 'lydian',
    name: 'Lydian',
    chords: ['maj', '', '7', '', 'min', '', 'dim', 'maj', '', 'min', '', 'min'],
    steps: [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
  },
  mixolydian: {
    handle: 'mixolydian',
    name: 'Mixolydian',
    chords: ['7', '', 'min', '', 'dim', 'maj', '', 'min', '', 'min', 'maj', ''],
    steps: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0],
  },
  locrian: {
    handle: 'locrian',
    name: 'Locrian',
    chords: ['dim', 'maj', '', 'min', '', 'min', 'maj', '', '7', '', 'min', ''],
    steps: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  },
  majorPenta: {
    handle: 'majorPenta',
    name: 'Major pentatonic',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0],
  },
  minorPenta: {
    handle: 'minorPenta',
    name: 'Minor pentatonic',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
  },
  acoustic: {
    handle: 'acoustic',
    name: 'Acoustic',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0],
  },
  adonai: {
    handle: 'adonai',
    name: 'Adonai malakh',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  },
  algerian: {
    handle: 'algerian',
    name: 'Algerian',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1],
  },
  augmented: {
    handle: 'augmented',
    name: 'Augmented',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1],
  },
  bebopDom: {
    handle: 'bebopDom',
    name: 'Bebop dominant',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1],
  },
  bebopMaj: {
    handle: 'bebopMaj',
    name: 'Bebop major',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1],
  },
  bluesHexa: {
    handle: 'bluesHexa',
    name: 'Blues hexatonic',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 0, 1, 0, 1, 1, 1, 0, 0, 1, 0],
  },
  doubleHarmonic: {
    handle: 'doubleHarmonic',
    name: 'Double harmonic',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1],
  },
  enigmatic: {
    handle: 'enigmatic',
    name: 'Enigmatic',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1],
  },
  gypsy: {
    handle: 'gypsy',
    name: 'Gypsy',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0],
  },
  halfDim: {
    handle: 'halfDim',
    name: 'Half diminished',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0],
  },
  harmonicMaj: {
    handle: 'harmonicMaj',
    name: 'Harmonic major',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1],
  },
  harmonicMin: {
    handle: 'harmonicMin',
    name: 'Harmonic minor',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 0, 1],
  },
  hungarianMin: {
    handle: 'hungarianMin',
    name: 'Hungarian minor',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1],
  },
  istrian: {
    handle: 'istrian',
    name: 'Istrian',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 0, 0],
  },
  lydianAug: {
    handle: 'lydianAug',
    name: 'Lydian augmented',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  },
  majLocrian: {
    handle: 'majLocrian',
    name: 'Major locrian',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0],
  },
  jazzMin: {
    handle: 'jazzMin',
    name: 'Jazz minor',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  },
  neapolitanMaj: {
    handle: 'neapolitanMaj',
    name: 'Neapolitan major',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
  },
  neapolitanMin: {
    handle: 'neapolitanMin',
    name: 'Neapolitan minor',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1],
  },
  octatonic: {
    handle: 'octatonic',
    name: 'Octatonic (diminished)',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1],
  },
  persian: {
    handle: 'persian',
    name: 'Persian',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1],
  },
  phrygianDom: {
    handle: 'phrygianDom',
    name: 'Phrygian dominant',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0],
  },
  prometheus: {
    handle: 'prometheus',
    name: 'Prometheus',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
  },
  tritone: {
    handle: 'tritone',
    name: 'Tritone',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0],
  },
  ukranianDorian: {
    handle: 'ukranianDorian',
    name: 'Ukranian dorian',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0],
  },
  wholeTone: {
    handle: 'wholeTone',
    name: 'Whole tone',
    chords: ['', '', '', '', '', '', '', '', '', '', '', ''],
    steps: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
  },
  chromatic: {
    handle: 'chromatic',
    name: 'Chromatic',
    chords: [
      '1/1',
      '25/24',
      '9/8',
      '6/5',
      '5/4',
      '4/3',
      '45/32',
      '3/2',
      '8/5',
      '5/3',
      '9/5',
      '15/8',
    ],
    steps: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  },
}
