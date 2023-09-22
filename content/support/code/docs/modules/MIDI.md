[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / MIDI

# Module: MIDI

## Table of contents

### Interfaces

- [ChromaNote](../interfaces/MIDI.ChromaNote.md)
- [MidiInterface](../interfaces/MIDI.MidiInterface.md)
- [NoteMessageEvent](../interfaces/MIDI.NoteMessageEvent.md)

### Variables

- [midi](MIDI.md#midi)

### Functions

- [forwardMidi](MIDI.md#forwardmidi)
- [learnCC](MIDI.md#learncc)
- [midiAttack](MIDI.md#midiattack)
- [midiOnce](MIDI.md#midionce)
- [midiPlay](MIDI.md#midiplay)
- [midiRelease](MIDI.md#midirelease)
- [midiStop](MIDI.md#midistop)
- [playKey](MIDI.md#playkey)
- [setCC](MIDI.md#setcc)
- [sortNotes](MIDI.md#sortnotes)
- [stopAll](MIDI.md#stopall)
- [useMidi](MIDI.md#usemidi)

## Variables

### midi

• `Const` **midi**: [`MidiInterface`](../interfaces/MIDI.MidiInterface.md)

#### Defined in

[use/midi.ts:73](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L73)

## Functions

### forwardMidi

▸ **forwardMidi**(`iid`, `oid`): `void`

Sets a forwarding route from an Input to an Output

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `iid` | `string` | Input ID |
| `oid` | `string` | Output ID |

#### Returns

`void`

#### Defined in

[use/midi.ts:489](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L489)

___

### learnCC

▸ **learnCC**(`«destructured»`): `Ref`<`number`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `Object` |
| › `channel` | `number` |
| › `number` | `number` |

#### Returns

`Ref`<`number`\>

#### Defined in

[use/midi.ts:134](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L134)

___

### midiAttack

▸ **midiAttack**(`note`, `options`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `Object` |
| `note.channel` | `number` |
| `note.number` | `string` \| `number` |
| `options` | `Object` |
| `options.attack?` | `number` |
| `options.channels?` | `number` \| `number`[] |
| `options.duration?` | `number` |
| `options.rawAttack?` | `number` |
| `options.rawRelease?` | `number` |
| `options.release?` | `number` |
| `options.time?` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[use/midi.ts:394](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L394)

___

### midiOnce

▸ **midiOnce**(`note`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` \| `number` \| `string`[] \| `number`[] \| `Note` \| `Note`[] |
| `options?` | `Object` |
| `options.attack?` | `any` |
| `options.channels` | `number` \| `number`[] |
| `options.duration?` | `number` |
| `options.rawAttack?` | `number` |
| `options.rawRelease` | `number` |
| `options.release` | `number` |
| `options.time` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[use/midi.ts:457](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L457)

___

### midiPlay

▸ **midiPlay**(`note`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `string` \| `number` \| `string`[] \| `number`[] \| `Note` \| `Note`[] |
| `options?` | `Object` |
| `options.attack?` | `number` |
| `options.channels?` | `number` \| `number`[] |
| `options.duration?` | `number` |
| `options.rawAttack?` | `number` |
| `options.rawRelease?` | `number` |
| `options.release?` | `number` |
| `options.time?` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[use/midi.ts:406](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L406)

___

### midiRelease

▸ **midiRelease**(`note`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note` | `Object` |
| `note.channel` | `number` |
| `note.number` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[use/midi.ts:441](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L441)

___

### midiStop

▸ **midiStop**(`note?`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `note?` | `string` \| `number` \| `string`[] \| `number`[] \| `Note` \| `Note`[] |
| `options?` | `Object` |
| `options.channels?` | `number` \| `number`[] |
| `options.rawRelease?` | `number` |
| `options.release?` | `number` |
| `options.time?` | `string` \| `number` |

#### Returns

`void`

#### Defined in

[use/midi.ts:426](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L426)

___

### playKey

▸ **playKey**(`name`, `offset?`, `off?`, `velocity?`, `duration?`): `void`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `name` | `string` | `undefined` |
| `offset` | `number` | `0` |
| `off?` | `boolean` | `undefined` |
| `velocity` | `number` | `1` |
| `duration?` | `number` | `undefined` |

#### Returns

`void`

#### Defined in

[use/midi.ts:147](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L147)

___

### setCC

▸ **setCC**(`cc`, `value`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `cc` | `Object` |
| `cc.channel` | `Object` |
| `cc.channel.channels?` | `number` \| `number`[] |
| `cc.channel.time?` | `string` \| `number` |
| `cc.number` | `string` \| `number` |
| `value` | `number` |

#### Returns

`void`

#### Defined in

[use/midi.ts:465](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L465)

___

### sortNotes

▸ **sortNotes**(`notes`, `reverse?`): `any`[]

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `notes` | `Note` | `undefined` |
| `reverse` | `boolean` | `false` |

#### Returns

`any`[]

#### Defined in

[use/midi.ts:505](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L505)

___

### stopAll

▸ **stopAll**(): `void`

#### Returns

`void`

#### Defined in

[use/midi.ts:472](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L472)

___

### useMidi

▸ **useMidi**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `midi` | [`MidiInterface`](../interfaces/MIDI.MidiInterface.md) |
| `midiAttack` | (`note`: { `channel`: `number` ; `number`: `string` \| `number`  }, `options`: { `attack?`: `number` ; `channels?`: `number` \| `number`[] ; `duration?`: `number` ; `rawAttack?`: `number` ; `rawRelease?`: `number` ; `release?`: `number` ; `time?`: `string` \| `number`  }) => `void` |
| `midiOnce` | (`note`: `string` \| `number` \| `string`[] \| `number`[] \| `Note` \| `Note`[], `options?`: { `attack?`: `any` ; `channels`: `number` \| `number`[] ; `duration?`: `number` ; `rawAttack?`: `number` ; `rawRelease`: `number` ; `release`: `number` ; `time`: `string` \| `number`  }) => `void` |
| `midiPlay` | (`note`: `string` \| `number` \| `string`[] \| `number`[] \| `Note` \| `Note`[], `options?`: { `attack?`: `number` ; `channels?`: `number` \| `number`[] ; `duration?`: `number` ; `rawAttack?`: `number` ; `rawRelease?`: `number` ; `release?`: `number` ; `time?`: `string` \| `number`  }) => `void` |
| `midiRelease` | (`note`: { `channel`: `number` ; `number`: `string` \| `number`  }) => `void` |
| `midiStop` | (`note?`: `string` \| `number` \| `string`[] \| `number`[] \| `Note` \| `Note`[], `options?`: { `channels?`: `number` \| `number`[] ; `rawRelease?`: `number` ; `release?`: `number` ; `time?`: `string` \| `number`  }) => `void` |
| `setCC` | (`cc`: { `channel`: { `channels?`: `number` \| `number`[] ; `time?`: `string` \| `number`  } ; `number`: `string` \| `number`  }, `value`: `number`) => `void` |

#### Defined in

[use/midi.ts:166](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/midi.ts#L166)
