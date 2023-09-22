[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / MusicTheory

# Module: MusicTheory

## Table of contents

### Variables

- [chordList](MusicTheory.md#chordlist)
- [chordType](MusicTheory.md#chordtype)
- [chords](MusicTheory.md#chords)
- [flats](MusicTheory.md#flats)
- [intervals](MusicTheory.md#intervals)
- [naturals](MusicTheory.md#naturals)
- [noteNames](MusicTheory.md#notenames)
- [notes](MusicTheory.md#notes)
- [scaleList](MusicTheory.md#scalelist)
- [scaleType](MusicTheory.md#scaletype)
- [scales](MusicTheory.md#scales)
- [sharps](MusicTheory.md#sharps)

## Variables

### chordList

• `Const` **chordList**: typeof `ChordType`[]

#### Defined in

[use/theory.ts:25](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L25)

___

### chordType

• `Const` **chordType**: typeof `ChordType` = `ChordType`

#### Defined in

[use/theory.ts:21](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L21)

___

### chords

• `Const` **chords**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `+7` | { `handle`: `string` = '+7'; `name`: `string` = 'Augmented 7th'; `semitones`: `number`[]  } |
| `+7.handle` | `string` |
| `+7.name` | `string` |
| `+7.semitones` | `number`[] |
| `+M7` | { `handle`: `string` = '+M7'; `name`: `string` = 'Augmented major 7th'; `semitones`: `number`[]  } |
| `+M7.handle` | `string` |
| `+M7.name` | `string` |
| `+M7.semitones` | `number`[] |
| `07` | { `handle`: `string` = '07'; `name`: `string` = 'Half-diminished 7th'; `semitones`: `number`[]  } |
| `07.handle` | `string` |
| `07.name` | `string` |
| `07.semitones` | `number`[] |
| `6` | { `handle`: `string` = '6'; `name`: `string` = 'Major 6th'; `semitones`: `number`[]  } |
| `6.handle` | `string` |
| `6.name` | `string` |
| `6.semitones` | `number`[] |
| `7` | { `handle`: `string` = '7'; `name`: `string` = 'Dominant 7th'; `semitones`: `number`[]  } |
| `7.handle` | `string` |
| `7.name` | `string` |
| `7.semitones` | `number`[] |
| `9` | { `handle`: `string` = '9'; `name`: `string` = '9th'; `semitones`: `number`[]  } |
| `9.handle` | `string` |
| `9.name` | `string` |
| `9.semitones` | `number`[] |
| `M7` | { `handle`: `string` = 'M7'; `name`: `string` = 'Major 7th'; `semitones`: `number`[]  } |
| `M7.handle` | `string` |
| `M7.name` | `string` |
| `M7.semitones` | `number`[] |
| `aug` | { `handle`: `string` = 'aug'; `name`: `string` = 'Augmented'; `semitones`: `number`[]  } |
| `aug.handle` | `string` |
| `aug.name` | `string` |
| `aug.semitones` | `number`[] |
| `dim` | { `handle`: `string` = 'dim'; `name`: `string` = 'Diminished'; `semitones`: `number`[]  } |
| `dim.handle` | `string` |
| `dim.name` | `string` |
| `dim.semitones` | `number`[] |
| `m6` | { `handle`: `string` = 'm6'; `name`: `string` = 'Minor 6th'; `semitones`: `number`[]  } |
| `m6.handle` | `string` |
| `m6.name` | `string` |
| `m6.semitones` | `number`[] |
| `m7` | { `handle`: `string` = 'm7'; `name`: `string` = 'Minor 7th'; `semitones`: `number`[]  } |
| `m7.handle` | `string` |
| `m7.name` | `string` |
| `m7.semitones` | `number`[] |
| `maj` | { `handle`: `string` = 'maj'; `name`: `string` = 'Major'; `semitones`: `number`[]  } |
| `maj.handle` | `string` |
| `maj.name` | `string` |
| `maj.semitones` | `number`[] |
| `min` | { `handle`: `string` = 'min'; `name`: `string` = 'Minor'; `semitones`: `number`[]  } |
| `min.handle` | `string` |
| `min.name` | `string` |
| `min.semitones` | `number`[] |
| `o7` | { `handle`: `string` = 'o7'; `name`: `string` = 'Diminished 7th'; `semitones`: `number`[]  } |
| `o7.handle` | `string` |
| `o7.name` | `string` |
| `o7.semitones` | `number`[] |
| `sus2` | { `handle`: `string` = 'sus2'; `name`: `string` = 'Suspended 2nd'; `semitones`: `number`[]  } |
| `sus2.handle` | `string` |
| `sus2.name` | `string` |
| `sus2.semitones` | `number`[] |
| `sus4` | { `handle`: `string` = 'sus4'; `name`: `string` = 'Suspended 4th'; `semitones`: `number`[]  } |
| `sus4.handle` | `string` |
| `sus4.name` | `string` |
| `sus4.semitones` | `number`[] |

#### Defined in

[use/theory.ts:50](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L50)

___

### flats

• `Const` **flats**: `string`[]

#### Defined in

[use/theory.ts:35](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L35)

___

### intervals

• `Const` **intervals**: `string`[]

#### Defined in

[use/theory.ts:29](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L29)

___

### naturals

• `Const` **naturals**: `string`[]

#### Defined in

[use/theory.ts:33](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L33)

___

### noteNames

• `Const` **noteNames**: `any`[] = `[]`

#### Defined in

[use/theory.ts:31](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L31)

___

### notes

• `Const` **notes**: `string`[] = `naturals`

#### Defined in

[use/theory.ts:47](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L47)

___

### scaleList

• `Const` **scaleList**: typeof `ScaleType`[]

#### Defined in

[use/theory.ts:27](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L27)

___

### scaleType

• `Const` **scaleType**: typeof `ScaleType` = `ScaleType`

#### Defined in

[use/theory.ts:22](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L22)

___

### scales

• `Const` **scales**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acoustic` | { `chords`: `string`[] ; `handle`: `string` = 'acoustic'; `name`: `string` = 'Acoustic'; `steps`: `number`[]  } |
| `acoustic.chords` | `string`[] |
| `acoustic.handle` | `string` |
| `acoustic.name` | `string` |
| `acoustic.steps` | `number`[] |
| `adonai` | { `chords`: `string`[] ; `handle`: `string` = 'adonai'; `name`: `string` = 'Adonai malakh'; `steps`: `number`[]  } |
| `adonai.chords` | `string`[] |
| `adonai.handle` | `string` |
| `adonai.name` | `string` |
| `adonai.steps` | `number`[] |
| `algerian` | { `chords`: `string`[] ; `handle`: `string` = 'algerian'; `name`: `string` = 'Algerian'; `steps`: `number`[]  } |
| `algerian.chords` | `string`[] |
| `algerian.handle` | `string` |
| `algerian.name` | `string` |
| `algerian.steps` | `number`[] |
| `augmented` | { `chords`: `string`[] ; `handle`: `string` = 'augmented'; `name`: `string` = 'Augmented'; `steps`: `number`[]  } |
| `augmented.chords` | `string`[] |
| `augmented.handle` | `string` |
| `augmented.name` | `string` |
| `augmented.steps` | `number`[] |
| `bebopDom` | { `chords`: `string`[] ; `handle`: `string` = 'bebopDom'; `name`: `string` = 'Bebop dominant'; `steps`: `number`[]  } |
| `bebopDom.chords` | `string`[] |
| `bebopDom.handle` | `string` |
| `bebopDom.name` | `string` |
| `bebopDom.steps` | `number`[] |
| `bebopMaj` | { `chords`: `string`[] ; `handle`: `string` = 'bebopMaj'; `name`: `string` = 'Bebop major'; `steps`: `number`[]  } |
| `bebopMaj.chords` | `string`[] |
| `bebopMaj.handle` | `string` |
| `bebopMaj.name` | `string` |
| `bebopMaj.steps` | `number`[] |
| `bluesHexa` | { `chords`: `string`[] ; `handle`: `string` = 'bluesHexa'; `name`: `string` = 'Blues hexatonic'; `steps`: `number`[]  } |
| `bluesHexa.chords` | `string`[] |
| `bluesHexa.handle` | `string` |
| `bluesHexa.name` | `string` |
| `bluesHexa.steps` | `number`[] |
| `chromatic` | { `chords`: `string`[] ; `handle`: `string` = 'chromatic'; `name`: `string` = 'Chromatic'; `steps`: `number`[]  } |
| `chromatic.chords` | `string`[] |
| `chromatic.handle` | `string` |
| `chromatic.name` | `string` |
| `chromatic.steps` | `number`[] |
| `dorian` | { `chords`: `string`[] ; `handle`: `string` = 'dorian'; `name`: `string` = 'Dorian'; `steps`: `number`[]  } |
| `dorian.chords` | `string`[] |
| `dorian.handle` | `string` |
| `dorian.name` | `string` |
| `dorian.steps` | `number`[] |
| `doubleHarmonic` | { `chords`: `string`[] ; `handle`: `string` = 'doubleHarmonic'; `name`: `string` = 'Double harmonic'; `steps`: `number`[]  } |
| `doubleHarmonic.chords` | `string`[] |
| `doubleHarmonic.handle` | `string` |
| `doubleHarmonic.name` | `string` |
| `doubleHarmonic.steps` | `number`[] |
| `enigmatic` | { `chords`: `string`[] ; `handle`: `string` = 'enigmatic'; `name`: `string` = 'Enigmatic'; `steps`: `number`[]  } |
| `enigmatic.chords` | `string`[] |
| `enigmatic.handle` | `string` |
| `enigmatic.name` | `string` |
| `enigmatic.steps` | `number`[] |
| `gypsy` | { `chords`: `string`[] ; `handle`: `string` = 'gypsy'; `name`: `string` = 'Gypsy'; `steps`: `number`[]  } |
| `gypsy.chords` | `string`[] |
| `gypsy.handle` | `string` |
| `gypsy.name` | `string` |
| `gypsy.steps` | `number`[] |
| `halfDim` | { `chords`: `string`[] ; `handle`: `string` = 'halfDim'; `name`: `string` = 'Half diminished'; `steps`: `number`[]  } |
| `halfDim.chords` | `string`[] |
| `halfDim.handle` | `string` |
| `halfDim.name` | `string` |
| `halfDim.steps` | `number`[] |
| `harmonicMaj` | { `chords`: `string`[] ; `handle`: `string` = 'harmonicMaj'; `name`: `string` = 'Harmonic major'; `steps`: `number`[]  } |
| `harmonicMaj.chords` | `string`[] |
| `harmonicMaj.handle` | `string` |
| `harmonicMaj.name` | `string` |
| `harmonicMaj.steps` | `number`[] |
| `harmonicMin` | { `chords`: `string`[] ; `handle`: `string` = 'harmonicMin'; `name`: `string` = 'Harmonic minor'; `steps`: `number`[]  } |
| `harmonicMin.chords` | `string`[] |
| `harmonicMin.handle` | `string` |
| `harmonicMin.name` | `string` |
| `harmonicMin.steps` | `number`[] |
| `hungarianMin` | { `chords`: `string`[] ; `handle`: `string` = 'hungarianMin'; `name`: `string` = 'Hungarian minor'; `steps`: `number`[]  } |
| `hungarianMin.chords` | `string`[] |
| `hungarianMin.handle` | `string` |
| `hungarianMin.name` | `string` |
| `hungarianMin.steps` | `number`[] |
| `istrian` | { `chords`: `string`[] ; `handle`: `string` = 'istrian'; `name`: `string` = 'Istrian'; `steps`: `number`[]  } |
| `istrian.chords` | `string`[] |
| `istrian.handle` | `string` |
| `istrian.name` | `string` |
| `istrian.steps` | `number`[] |
| `jazzMin` | { `chords`: `string`[] ; `handle`: `string` = 'jazzMin'; `name`: `string` = 'Jazz minor'; `steps`: `number`[]  } |
| `jazzMin.chords` | `string`[] |
| `jazzMin.handle` | `string` |
| `jazzMin.name` | `string` |
| `jazzMin.steps` | `number`[] |
| `locrian` | { `chords`: `string`[] ; `handle`: `string` = 'locrian'; `name`: `string` = 'Locrian'; `steps`: `number`[]  } |
| `locrian.chords` | `string`[] |
| `locrian.handle` | `string` |
| `locrian.name` | `string` |
| `locrian.steps` | `number`[] |
| `lydian` | { `chords`: `string`[] ; `handle`: `string` = 'lydian'; `name`: `string` = 'Lydian'; `steps`: `number`[]  } |
| `lydian.chords` | `string`[] |
| `lydian.handle` | `string` |
| `lydian.name` | `string` |
| `lydian.steps` | `number`[] |
| `lydianAug` | { `chords`: `string`[] ; `handle`: `string` = 'lydianAug'; `name`: `string` = 'Lydian augmented'; `steps`: `number`[]  } |
| `lydianAug.chords` | `string`[] |
| `lydianAug.handle` | `string` |
| `lydianAug.name` | `string` |
| `lydianAug.steps` | `number`[] |
| `majLocrian` | { `chords`: `string`[] ; `handle`: `string` = 'majLocrian'; `name`: `string` = 'Major locrian'; `steps`: `number`[]  } |
| `majLocrian.chords` | `string`[] |
| `majLocrian.handle` | `string` |
| `majLocrian.name` | `string` |
| `majLocrian.steps` | `number`[] |
| `major` | { `chords`: `string`[] ; `handle`: `string` = 'major'; `name`: `string` = 'Major (Ionian)'; `steps`: `number`[]  } |
| `major.chords` | `string`[] |
| `major.handle` | `string` |
| `major.name` | `string` |
| `major.steps` | `number`[] |
| `majorPenta` | { `chords`: `string`[] ; `handle`: `string` = 'majorPenta'; `name`: `string` = 'Major pentatonic'; `steps`: `number`[]  } |
| `majorPenta.chords` | `string`[] |
| `majorPenta.handle` | `string` |
| `majorPenta.name` | `string` |
| `majorPenta.steps` | `number`[] |
| `minor` | { `chords`: `string`[] ; `handle`: `string` = 'minor'; `name`: `string` = 'Minor (Aeolian)'; `steps`: `number`[]  } |
| `minor.chords` | `string`[] |
| `minor.handle` | `string` |
| `minor.name` | `string` |
| `minor.steps` | `number`[] |
| `minorPenta` | { `chords`: `string`[] ; `handle`: `string` = 'minorPenta'; `name`: `string` = 'Minor pentatonic'; `steps`: `number`[]  } |
| `minorPenta.chords` | `string`[] |
| `minorPenta.handle` | `string` |
| `minorPenta.name` | `string` |
| `minorPenta.steps` | `number`[] |
| `mixolydian` | { `chords`: `string`[] ; `handle`: `string` = 'mixolydian'; `name`: `string` = 'Mixolydian'; `steps`: `number`[]  } |
| `mixolydian.chords` | `string`[] |
| `mixolydian.handle` | `string` |
| `mixolydian.name` | `string` |
| `mixolydian.steps` | `number`[] |
| `neapolitanMaj` | { `chords`: `string`[] ; `handle`: `string` = 'neapolitanMaj'; `name`: `string` = 'Neapolitan major'; `steps`: `number`[]  } |
| `neapolitanMaj.chords` | `string`[] |
| `neapolitanMaj.handle` | `string` |
| `neapolitanMaj.name` | `string` |
| `neapolitanMaj.steps` | `number`[] |
| `neapolitanMin` | { `chords`: `string`[] ; `handle`: `string` = 'neapolitanMin'; `name`: `string` = 'Neapolitan minor'; `steps`: `number`[]  } |
| `neapolitanMin.chords` | `string`[] |
| `neapolitanMin.handle` | `string` |
| `neapolitanMin.name` | `string` |
| `neapolitanMin.steps` | `number`[] |
| `octatonic` | { `chords`: `string`[] ; `handle`: `string` = 'octatonic'; `name`: `string` = 'Octatonic (diminished)'; `steps`: `number`[]  } |
| `octatonic.chords` | `string`[] |
| `octatonic.handle` | `string` |
| `octatonic.name` | `string` |
| `octatonic.steps` | `number`[] |
| `persian` | { `chords`: `string`[] ; `handle`: `string` = 'persian'; `name`: `string` = 'Persian'; `steps`: `number`[]  } |
| `persian.chords` | `string`[] |
| `persian.handle` | `string` |
| `persian.name` | `string` |
| `persian.steps` | `number`[] |
| `phrygian` | { `chords`: `string`[] ; `handle`: `string` = 'phrygian'; `name`: `string` = 'Phrygian'; `steps`: `number`[]  } |
| `phrygian.chords` | `string`[] |
| `phrygian.handle` | `string` |
| `phrygian.name` | `string` |
| `phrygian.steps` | `number`[] |
| `phrygianDom` | { `chords`: `string`[] ; `handle`: `string` = 'phrygianDom'; `name`: `string` = 'Phrygian dominant'; `steps`: `number`[]  } |
| `phrygianDom.chords` | `string`[] |
| `phrygianDom.handle` | `string` |
| `phrygianDom.name` | `string` |
| `phrygianDom.steps` | `number`[] |
| `prometheus` | { `chords`: `string`[] ; `handle`: `string` = 'prometheus'; `name`: `string` = 'Prometheus'; `steps`: `number`[]  } |
| `prometheus.chords` | `string`[] |
| `prometheus.handle` | `string` |
| `prometheus.name` | `string` |
| `prometheus.steps` | `number`[] |
| `tritone` | { `chords`: `string`[] ; `handle`: `string` = 'tritone'; `name`: `string` = 'Tritone'; `steps`: `number`[]  } |
| `tritone.chords` | `string`[] |
| `tritone.handle` | `string` |
| `tritone.name` | `string` |
| `tritone.steps` | `number`[] |
| `ukranianDorian` | { `chords`: `string`[] ; `handle`: `string` = 'ukranianDorian'; `name`: `string` = 'Ukranian dorian'; `steps`: `number`[]  } |
| `ukranianDorian.chords` | `string`[] |
| `ukranianDorian.handle` | `string` |
| `ukranianDorian.name` | `string` |
| `ukranianDorian.steps` | `number`[] |
| `wholeTone` | { `chords`: `string`[] ; `handle`: `string` = 'wholeTone'; `name`: `string` = 'Whole tone'; `steps`: `number`[]  } |
| `wholeTone.chords` | `string`[] |
| `wholeTone.handle` | `string` |
| `wholeTone.name` | `string` |
| `wholeTone.steps` | `number`[] |

#### Defined in

[use/theory.ts:70](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L70)

___

### sharps

• `Const` **sharps**: `string`[]

#### Defined in

[use/theory.ts:34](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/theory.ts#L34)
