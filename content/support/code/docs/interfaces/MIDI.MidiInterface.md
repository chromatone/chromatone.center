[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / [MIDI](../modules/MIDI.md) / MidiInterface

# Interface: MidiInterface

[MIDI](../modules/MIDI.md).MidiInterface

## Table of contents

### Properties

- [activeNotes](MIDI.MidiInterface.md#activenotes)
- [attack](MIDI.MidiInterface.md#attack)
- [cc](MIDI.MidiInterface.md#cc)
- [channel](MIDI.MidiInterface.md#channel)
- [channels](MIDI.MidiInterface.md#channels)
- [clock](MIDI.MidiInterface.md#clock)
- [enabled](MIDI.MidiInterface.md#enabled)
- [filter](MIDI.MidiInterface.md#filter)
- [forwards](MIDI.MidiInterface.md#forwards)
- [guessChords](MIDI.MidiInterface.md#guesschords)
- [initiated](MIDI.MidiInterface.md#initiated)
- [inputs](MIDI.MidiInterface.md#inputs)
- [keyboard](MIDI.MidiInterface.md#keyboard)
- [log](MIDI.MidiInterface.md#log)
- [message](MIDI.MidiInterface.md#message)
- [note](MIDI.MidiInterface.md#note)
- [offset](MIDI.MidiInterface.md#offset)
- [once](MIDI.MidiInterface.md#once)
- [out](MIDI.MidiInterface.md#out)
- [outputs](MIDI.MidiInterface.md#outputs)
- [playing](MIDI.MidiInterface.md#playing)
- [release](MIDI.MidiInterface.md#release)
- [setCC](MIDI.MidiInterface.md#setcc)
- [stopAll](MIDI.MidiInterface.md#stopall)
- [stopped](MIDI.MidiInterface.md#stopped)
- [time](MIDI.MidiInterface.md#time)

## Properties

### activeNotes

• **activeNotes**: `Record`<`number`, `number` \| `boolean`\>

#### Defined in

[use/midi.ts:46](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L46)

___

### attack

• **attack**: `Function`

#### Defined in

[use/midi.ts:67](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L67)

___

### cc

• `Optional` **cc**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `channel?` | `number` |
| `number?` | `number` |
| `value?` | `number` |

#### Defined in

[use/midi.ts:54](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L54)

___

### channel

• **channel**: `number`

#### Defined in

[use/midi.ts:65](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L65)

___

### channels

• **channels**: `Record`<`number`, { `activeNotes`: {} ; `cc`: {} ; `notes`: {}  }\>

#### Defined in

[use/midi.ts:45](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L45)

___

### clock

• `Optional` **clock**: `number`

#### Defined in

[use/midi.ts:61](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L61)

___

### enabled

• **enabled**: `boolean`

#### Defined in

[use/midi.ts:16](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L16)

___

### filter

• `Optional` **filter**: `Object`

#### Defined in

[use/midi.ts:64](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L64)

___

### forwards

• **forwards**: `Record`<`string`, `Record`<`string`, `boolean`\>\>

#### Defined in

[use/midi.ts:44](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L44)

___

### guessChords

• **guessChords**: `string`[]

#### Defined in

[use/midi.ts:47](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L47)

___

### initiated

• **initiated**: `boolean`

#### Defined in

[use/midi.ts:17](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L17)

___

### inputs

• **inputs**: `Record`<`string`, { `bpm?`: `number` ; `cc`: { `channel`: `number` ; `number`: `number` ; `port`: `string` ; `raw`: `number` ; `timestamp`: `number` ; `value`: `number`  } ; `clock`: `number` ; `diff?`: `number` ; `event?`: `Event` ; `forwarder`: `Forwarder` ; `manufacturer`: `string` ; `name`: `string` ; `note`: [`ChromaNote`](MIDI.ChromaNote.md)  }\>

#### Defined in

[use/midi.ts:22](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L22)

___

### keyboard

• **keyboard**: `boolean`

#### Defined in

[use/midi.ts:20](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L20)

___

### log

• **log**: `MessageEvent`[]

#### Defined in

[use/midi.ts:62](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L62)

___

### message

• **message**: `Message`

#### Defined in

[use/midi.ts:63](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L63)

___

### note

• **note**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `channel` | `number` |
| `number?` | `number` |
| `pitch` | `number` |
| `velocity?` | `number` |

#### Defined in

[use/midi.ts:48](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L48)

___

### offset

• **offset**: `number`

#### Defined in

[use/midi.ts:59](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L59)

___

### once

• **once**: `Function`

#### Defined in

[use/midi.ts:69](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L69)

___

### out

• **out**: `boolean`

#### Defined in

[use/midi.ts:21](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L21)

___

### outputs

• **outputs**: `Record`<`string`, { `manufacturer`: `string` ; `name`: `string`  }\>

#### Defined in

[use/midi.ts:40](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L40)

___

### playing

• **playing**: `boolean`

#### Defined in

[use/midi.ts:18](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L18)

___

### release

• **release**: `Function`

#### Defined in

[use/midi.ts:68](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L68)

___

### setCC

• **setCC**: `Function`

#### Defined in

[use/midi.ts:70](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L70)

___

### stopAll

• **stopAll**: `Function`

#### Defined in

[use/midi.ts:66](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L66)

___

### stopped

• **stopped**: `number` \| `boolean`

#### Defined in

[use/midi.ts:19](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L19)

___

### time

• `Optional` **time**: `number`

#### Defined in

[use/midi.ts:60](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L60)
