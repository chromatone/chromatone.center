[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Calculations

# Module: Calculations

**`Description`**

All the basic math for note-frequency convertion

## Table of contents

### Variables

- [midiA](Calculations.md#midia)

### Functions

- [freqColor](Calculations.md#freqcolor)
- [freqPitch](Calculations.md#freqpitch)
- [getCents](Calculations.md#getcents)
- [getCircleCoord](Calculations.md#getcirclecoord)
- [getStandardFrequency](Calculations.md#getstandardfrequency)
- [isInChroma](Calculations.md#isinchroma)
- [midiColor](Calculations.md#midicolor)
- [pitchColor](Calculations.md#pitchcolor)
- [pitchFreq](Calculations.md#pitchfreq)
- [pitchNoteOctave](Calculations.md#pitchnoteoctave)
- [rotateArray](Calculations.md#rotatearray)

## Variables

### midiA

• `Const` **midiA**: ``69``

Note 0 in MIDI

#### Defined in

[use/calculations.ts:9](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L9)

## Functions

### freqColor

▸ **freqColor**(`freq`): `string`

Get a color for a certain pitch frequency in Hz

#### Parameters

| Name | Type |
| :------ | :------ |
| `freq` | `number` |

#### Returns

`string`

#### Defined in

[use/calculations.ts:61](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L61)

___

### freqPitch

▸ **freqPitch**(`freq`, `middleA?`): `number`

Get a pitch from a frequency

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `freq` | `string` \| `number` | `undefined` |
| `middleA` | `number` | `440` |

#### Returns

`number`

#### Defined in

[use/calculations.ts:68](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L68)

___

### getCents

▸ **getCents**(`frequency`, `pitch`): `number`

Get cents difference between a certain pitch and an arbitrary frequency

#### Parameters

| Name | Type |
| :------ | :------ |
| `frequency` | `number` |
| `pitch` | `number` |

#### Returns

`number`

#### Defined in

[use/calculations.ts:98](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L98)

___

### getCircleCoord

▸ **getCircleCoord**(`n?`, `total?`, `radius?`, `width?`): `Object`

Radial coordinates calculation

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `n` | `number` | `0` |
| `total` | `number` | `12` |
| `radius` | `number` | `35` |
| `width` | `number` | `100` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `y` | `number` |

#### Defined in

[use/calculations.ts:82](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L82)

___

### getStandardFrequency

▸ **getStandardFrequency**(`pitch`, `middleA?`): `number`

Get a frequency for any given pitch

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pitch` | `number` | `undefined` |
| `middleA` | `number` | `440` |

#### Returns

`number`

#### Defined in

[use/calculations.ts:106](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L106)

___

### isInChroma

▸ **isInChroma**(`chroma`, `tonic`, `note`): `boolean`

Check if a note in included in a chroma string

#### Parameters

| Name | Type |
| :------ | :------ |
| `chroma` | `string` |
| `tonic` | `number` |
| `note` | `number` |

#### Returns

`boolean`

#### Defined in

[use/calculations.ts:75](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L75)

___

### midiColor

▸ **midiColor**(`note`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `number` |

#### Returns

`string`

#### Defined in

[use/calculations.ts:11](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L11)

___

### pitchColor

▸ **pitchColor**(`pitch?`, `octave?`, `velocity?`, `alpha?`): `string`

Get a color for any given pitch and octave (velocity and alpha are also configurable)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pitch` | `number` | `0` |
| `octave?` | `number` | `undefined` |
| `velocity` | `number` | `1` |
| `alpha` | `number` | `1` |

#### Returns

`string`

#### Defined in

[use/calculations.ts:50](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L50)

___

### pitchFreq

▸ **pitchFreq**(`pitch?`, `octave?`, `middleA?`, `tuning?`): `number`

Determine a frequency in Hz out of a pitch with octave and optional tuning info

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `pitch` | `number` | `0` |
| `octave` | `number` | `3` |
| `middleA` | `number` | `440` |
| `tuning` | `string` | `'equal'` |

#### Returns

`number`

#### Defined in

[use/calculations.ts:29](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L29)

___

### pitchNoteOctave

▸ **pitchNoteOctave**(`pitch`): `Object`

Convert an unbound pitch to 0-11 pitch + octave

#### Parameters

| Name | Type |
| :------ | :------ |
| `pitch` | `number` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `octave` | `number` |
| `pitch` | `number` |

#### Defined in

[use/calculations.ts:19](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L19)

___

### rotateArray

▸ **rotateArray**(`arr`, `count?`): `any`[]

Rotate and array by a number of steps

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `arr` | `any`[] | `undefined` |
| `count` | `number` | `1` |

#### Returns

`any`[]

#### Defined in

[use/calculations.ts:91](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/calculations.ts#L91)
