[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Microphone

# Module: Microphone

## Table of contents

### Variables

- [mic](Microphone.md#mic)

### Functions

- [useMic](Microphone.md#usemic)

## Variables

### mic

• `Const` **mic**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `gate` | `number` |
| `initiated` | `boolean` |
| `meter` | `number` |
| `monitor` | `boolean` |
| `open` | `boolean` |
| `opened` | `boolean` |
| `recording` | `boolean` |
| `volume` | `number` |

#### Defined in

[use/mic.ts:12](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/mic.ts#L12)

## Functions

### useMic

▸ **useMic**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `input` | `UserMedia` |
| `mic` | { `gate`: `number` ; `initiated`: `boolean` = false; `meter`: `number` = 0; `monitor`: `boolean` = false; `open`: `boolean` = false; `opened`: `boolean` = false; `recording`: `boolean` = true; `volume`: `number`  } |
| `mic.gate` | `number` |
| `mic.initiated` | `boolean` |
| `mic.meter` | `number` |
| `mic.monitor` | `boolean` |
| `mic.open` | `boolean` |
| `mic.opened` | `boolean` |
| `mic.recording` | `boolean` |
| `mic.volume` | `number` |

#### Defined in

[use/mic.ts:25](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/mic.ts#L25)
