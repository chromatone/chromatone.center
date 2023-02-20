[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / [MIDI](../modules/MIDI.md) / NoteMessageEvent

# Interface: NoteMessageEvent

[MIDI](../modules/MIDI.md).NoteMessageEvent

## Hierarchy

- `MessageEvent`

  ↳ **`NoteMessageEvent`**

## Table of contents

### Properties

- [channel](MIDI.NoteMessageEvent.md#channel)
- [message](MIDI.NoteMessageEvent.md#message)
- [note](MIDI.NoteMessageEvent.md#note)
- [port](MIDI.NoteMessageEvent.md#port)
- [rawValue](MIDI.NoteMessageEvent.md#rawvalue)
- [target](MIDI.NoteMessageEvent.md#target)
- [timestamp](MIDI.NoteMessageEvent.md#timestamp)
- [type](MIDI.NoteMessageEvent.md#type)
- [value](MIDI.NoteMessageEvent.md#value)

## Properties

### channel

• **channel**: `number`

#### Defined in

use/midi.ts:306

___

### message

• **message**: `Message`

#### Inherited from

MessageEvent.message

#### Defined in

node_modules/.pnpm/webmidi@3.1.4/node_modules/webmidi/dist/cjs/webmidi.cjs.d.ts:6122

___

### note

• **note**: `Note`

#### Defined in

use/midi.ts:307

___

### port

• **port**: `Input`

#### Overrides

MessageEvent.port

#### Defined in

use/midi.ts:308

___

### rawValue

• `Optional` **rawValue**: `number`

#### Inherited from

MessageEvent.rawValue

#### Defined in

node_modules/.pnpm/webmidi@3.1.4/node_modules/webmidi/dist/cjs/webmidi.cjs.d.ts:6124

___

### target

• **target**: `Input` \| `InputChannel`

#### Overrides

MessageEvent.target

#### Defined in

use/midi.ts:309

___

### timestamp

• **timestamp**: `number`

#### Inherited from

MessageEvent.timestamp

#### Defined in

node_modules/.pnpm/webmidi@3.1.4/node_modules/webmidi/dist/cjs/webmidi.cjs.d.ts:6050

___

### type

• **type**: `string`

#### Inherited from

MessageEvent.type

#### Defined in

node_modules/.pnpm/webmidi@3.1.4/node_modules/webmidi/dist/cjs/webmidi.cjs.d.ts:6051

___

### value

• `Optional` **value**: `number` \| `boolean`

#### Inherited from

MessageEvent.value

#### Defined in

node_modules/.pnpm/webmidi@3.1.4/node_modules/webmidi/dist/cjs/webmidi.cjs.d.ts:6126
