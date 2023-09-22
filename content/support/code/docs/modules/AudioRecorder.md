[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / AudioRecorder

# Module: AudioRecorder

## Table of contents

### Variables

- [record](AudioRecorder.md#record)
- [recorder](AudioRecorder.md#recorder)
- [recording](AudioRecorder.md#recording)

### Functions

- [useRecorder](AudioRecorder.md#userecorder)

## Variables

### record

• `Const` **record**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `start` | () => `void` |
| `stop` | () => `Promise`<`void`\> |

#### Defined in

[use/recorder.ts:21](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/recorder.ts#L21)

___

### recorder

• **recorder**: `Recorder`

#### Defined in

[use/recorder.ts:11](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/recorder.ts#L11)

___

### recording

• `Const` **recording**: `Ref`<`boolean`\>

#### Defined in

[use/recorder.ts:13](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/recorder.ts#L13)

## Functions

### useRecorder

▸ **useRecorder**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `duration` | `ComputedRef`<`number`\> |
| `record` | { `start`: () => `void` ; `stop`: () => `Promise`<`void`\>  } |
| `record.start` | [object Object] |
| `record.stop` | [object Object] |
| `recorder` | `Recorder` |
| `recording` | `Ref`<`boolean`\> |
| `toggled` | `Ref`<`number`\> |

#### Defined in

[use/recorder.ts:40](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/recorder.ts#L40)
