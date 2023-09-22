[Use-chromatone documentation](../README.md) / [Exports](../modules.md) / sequence

# Module: sequence

## Table of contents

### Interfaces

- [ClickSampler](../interfaces/sequence.ClickSampler.md)

### Variables

- [maxRatio](sequence.md#maxratio)
- [tracks](sequence.md#tracks)

### Functions

- [getEuclideanRhythm](sequence.md#geteuclideanrhythm)
- [useSequence](sequence.md#usesequence)

## Variables

### maxRatio

• `Const` **maxRatio**: `ComputedRef`<`number`\>

#### Defined in

[use/sequence.ts:65](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/sequence.ts#L65)

___

### tracks

• `Const` **tracks**: `any`[]

#### Defined in

[use/sequence.ts:62](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/sequence.ts#L62)

## Functions

### getEuclideanRhythm

▸ **getEuclideanRhythm**(`x`, `total`): `number`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `x` | `number` |
| `total` | `number` |

#### Returns

`number`[]

#### Defined in

[use/sequence.ts:370](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/sequence.ts#L370)

___

### useSequence

▸ **useSequence**(`initial?`, `order?`, `mode?`, `maxSteps?`): `Object`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `initial` | `Object` | `undefined` |
| `initial.over` | `number` | `4` |
| `initial.sound` | `string` | `"A"` |
| `initial.under` | `number` | `4` |
| `initial.volume` | `number` | `1` |
| `order` | `number` | `0` |
| `mode` | `string` | `"bar"` |
| `maxSteps` | `number` | `64` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `sampler` | [`ClickSampler`](../interfaces/sequence.ClickSampler.md) |
| `seq` | `any` |

#### Defined in

[use/sequence.ts:76](https://github.com/chromatone/chromatone.center/blob/a50ab21b4/use/sequence.ts#L76)
