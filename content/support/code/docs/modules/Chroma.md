[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / Chroma

# Module: Chroma

**`Description`**

Global scale info and chroma

## Table of contents

### Interfaces

- [NamedPitch](../interfaces/Chroma.NamedPitch.md)

### Variables

- [globalScale](Chroma.md#globalscale)

### Functions

- [playChroma](Chroma.md#playchroma)
- [playChromaOnce](Chroma.md#playchromaonce)
- [playNote](Chroma.md#playnote)
- [stopChroma](Chroma.md#stopchroma)
- [stopNote](Chroma.md#stopnote)

## Variables

### globalScale

• `Const` **globalScale**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `chroma` | `string` |
| `full` | `any` |
| `isIn` | (`noteName`: `string`) => `boolean` |
| `note` | [`NamedPitch`](../interfaces/Chroma.NamedPitch.md) |
| `pcs` | `string`[] |
| `set` | `any` |
| `tonic` | `number` |

#### Defined in

[use/chroma.ts:23](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/chroma.ts#L23)

## Functions

### playChroma

▸ **playChroma**(`chroma`, `tonic`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chroma` | `string` |
| `tonic` | `number` |

#### Returns

`void`

#### Defined in

[use/chroma.ts:68](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/chroma.ts#L68)

___

### playChromaOnce

▸ **playChromaOnce**(`chroma`, `tonic`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chroma` | `string` |
| `tonic` | `number` |

#### Returns

`void`

#### Defined in

[use/chroma.ts:58](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/chroma.ts#L58)

___

### playNote

▸ **playNote**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`void`

#### Defined in

[use/chroma.ts:86](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/chroma.ts#L86)

___

### stopChroma

▸ **stopChroma**(`chroma`, `tonic`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `chroma` | `any` |
| `tonic` | `any` |

#### Returns

`void`

#### Defined in

[use/chroma.ts:77](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/chroma.ts#L77)

___

### stopNote

▸ **stopNote**(`name`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `any` |

#### Returns

`void`

#### Defined in

[use/chroma.ts:92](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/chroma.ts#L92)
